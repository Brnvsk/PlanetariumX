import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { SSConfig, SolarPlanet } from './config';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-solar',
  templateUrl: './solar.component.html',
  styleUrls: ['./solar.component.scss'],
})
export class SolarComponent implements AfterViewInit {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private solarSystem!: any;
  private loader = new GLTFLoader()
  private solarSystemConfig = SSConfig
  private raycaster = new THREE.Raycaster()
  private raycastPoint: THREE.Vector2 | null = null
  private worldPos = new THREE.Vector3()
  private planetMeshUnderPointer: any | null = null
  private clickedPlanet: any | null = null

  private orbitControl!: OrbitControls;

  private inDetailsMode = false;
  public detailsData: SolarPlanet | null = null

  @ViewChild('canvas')
  public canvasRef!: ElementRef<HTMLCanvasElement>

  @ViewChild('canvasContainer')
  public canvasContainer!: ElementRef<HTMLElement>

  constructor(private location: Location) {}

  public ngAfterViewInit(): void {
    this.init().then(() => this.render())
  }

  public goBack() {
    this.location.back()
  }

  public onDetailsClose() {
    this.detailsData = null 

    this.orbitControl.reset()
    this.orbitControl.enabled = true;
    this.planetMeshUnderPointer = null;
    this.raycastPoint = null;
    this.clickedPlanet = null;
    this.inDetailsMode = false;   
  }

  private render() {
    requestAnimationFrame(() => { this.render() })
    this.animateSolarSystem()
    this.raycastPlanets()
    // followCamera(clickedPlanet)

    // orbitControl.update()

    this.renderer.render(this.scene, this.camera)
  }

  private async init() {
    this.scene = this.setupScene()
    this.camera = this.setupCamera()
    if (this.canvasContainer.nativeElement) {
      this.renderer = this.setupRenderer(this.canvasContainer.nativeElement)
    } else {
      console.error('No canvas container.')
    }

    const light = new THREE.AmbientLight(0xf0f0f0);
    this.scene.add(light);

    try {
      this.solarSystem = (await this.loadGLTF('./assets/models/solar/cartoon-solar-system.gltf')).scene
      this.solarSystem.traverse((child: any) => {
        if (child.isMesh) {
          child.material = child.material.clone()
        }
      })
      this.fillPlanetsConfig(this.solarSystem)
      this.scene.add(this.solarSystem)
    } catch (error) {
      console.error('Error loading solar system scene objects', error)
      this.solarSystem = null
    }

    this.orbitControl = new OrbitControls(this.camera, this.renderer.domElement)
    this.orbitControl.enableDamping = true
    // orbitControl.enableZoom = false
    this.orbitControl.maxPolarAngle = (Math.PI / 4) * 3
    this.orbitControl.minPolarAngle = (Math.PI / 4) * 1
    this.orbitControl.minDistance = 20;
    this.orbitControl.maxDistance = 50;

    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', (e) => {
      if (this.inDetailsMode) {
        return;
      }
      if (!this.raycastPoint) {
        this.raycastPoint = new THREE.Vector2()
      }
      const { x, y } = this.getPointerCoordinates(e)
      this.raycastPoint.x = x
      this.raycastPoint.y = y
    });

    window.addEventListener('click', (e) => {
      if (this.inDetailsMode) {
        return;
      }
      if (this.raycastPoint && this.planetMeshUnderPointer) {
        const planet = this.solarSystemConfig.items.find(it => it._name === this.planetMeshUnderPointer?.name)
        if (planet) {
          // this.disablePlanetHightlight()
          this.raycastPoint = null;
          setTimeout(() => {
            this.clickedPlanet = planet
            this.zoomToPlanetDetails()
          });
        }
      }
    })
  }

  private getPointerCoordinates(event: MouseEvent) {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    return { x, y }
  }

  private raycastPlanets() {
    if (!this.raycastPoint) {
      return;
    }
    this.raycaster.setFromCamera(this.raycastPoint, this.camera)

    const intersects = this.raycaster.intersectObjects(this.scene.children)
    if (intersects.length === 0 && this.planetMeshUnderPointer) {
      this.disablePlanetHightlight()
      return;
    }

    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
        const intersection = intersects[0];
        
        if (!this.planetMeshUnderPointer) {          
          this.planetMeshUnderPointer = intersection.object
          this.planetMeshUnderPointer.material.emissive.setRGB(.6, .6, .6)
        } else if (this.planetMeshUnderPointer.name !== (intersection.object as any).name) {
          this.planetMeshUnderPointer.material.emissive.setRGB(0, 0, 0)
          this.planetMeshUnderPointer = intersection.object
          this.planetMeshUnderPointer.material.emissive.setRGB(.6, .6, .6)
        }
    }
  }

  private animateSolarSystem() {
    if (!this.solarSystem) return

    if (!this.inDetailsMode) {
        this.solarSystem.rotation.y += this.solarSystemConfig.rotationSpeed
    }
    // solarSystem.rotation.y += solarSystemConfig.rotationSpeed
    const { rotSpeedMultiplier } = this.solarSystemConfig
    this.solarSystemConfig.items.forEach(planet => {
        if (planet.mesh) {
            planet.mesh.rotation.y += planet.yRot * rotSpeedMultiplier
            if (planet.xRot != null) {
                planet.mesh.rotation.x += planet.xRot * rotSpeedMultiplier
            }
            if (planet.zRot != null) {
                planet.mesh.rotation.z += planet.zRot * rotSpeedMultiplier
            }
        }
    })
  }

  private zoomToPlanetDetails() {
    this.inDetailsMode = true
    this.orbitControl.enabled = false;
    this.orbitControl.saveState()

    this.clickedPlanet?.mesh.getWorldPosition(this.worldPos)
    let bounds = this.clickedPlanet.mesh.geometry.boundingBox.max.z
    if (this.clickedPlanet._name === 'sun') {
      bounds += 4
    }
    const cameraOffset = new THREE.Vector3(-2, 1, bounds * 1.5);
    this.camera.position.copy(this.worldPos).add(cameraOffset);
    const { x, y, z } = this.worldPos
    this.camera.lookAt(x - 1.4, y, z)

    this.detailsData = this.clickedPlanet
    this.disablePlanetHightlight()

  }

  private setupScene() {
    const scene = new THREE.Scene()
    return scene
  }

  private setupCamera() {
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 10, 35)
    return camera
  }

  private setupRenderer(container: HTMLElement) {
    const renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    container.append(renderer.domElement)
    return renderer
  }

  private async loadGLTF(url: string): Promise<GLTF> {
    return new Promise((res, rej) => {
      this.loader.load(
        url,
        (e) => {
          res(e)
        },
        (e) => { },
        (e) => {
          rej(e)
        }
      )
    })
  }

  private fillPlanetsConfig(solarSystem: any) {
    const { children } = solarSystem
    children.forEach((mesh: THREE.Mesh) => {
      const index = this.solarSystemConfig.items.findIndex(it => it._name === mesh.name)
      if (index > -1) {
        //@ts-ignore
        this.solarSystemConfig.items[index].mesh = mesh
      }
    })
  }

  private disablePlanetHightlight() {
    this.planetMeshUnderPointer.material.emissive.setRGB(0, 0, 0)
    this.planetMeshUnderPointer = null;
    document.body.style.cursor = 'default';
  }

  private onWindowResize() {

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

  }
}
