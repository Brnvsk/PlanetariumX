import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AvatarsMap } from 'src/app/config/avatars.config';
import { UserService } from 'src/app/services/user.service';
import { ForwardsService } from 'src/app/shared/services/forwards.service';
import { User } from 'src/app/shared/types/user.type';

const bonstickPositions = {
  // hidden: {
  //   left: -1000,
  //   top: -1000
  // },
  solar: {
    left: 100,
    top: 20,
  },
  barley: {
    left: 850,
    top: 40,
  },
  memo: {
    left: 500,
    top: 300,
  },
  visual: {
    left: 950,
    top: 450,
  },
  learn: {
    left: 180,
    top: 450,
  },
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  public isShown = false;

  @ViewChild('bonstick', { static: true }) public bonstick?: ElementRef<HTMLImageElement>

  public bonstickPos = {
    left: 0,
    top: 0
  };
  public bonstickSrc = '';
  private activeTimeout?: any;

  constructor(
    private userService: UserService,
    ) {}

  public ngOnInit(): void {
    this.userService.user$.subscribe(user  => {
      const avatarSrc = AvatarsMap.find(a => a.id === user?.avatarId)?.src || AvatarsMap[0].src
      this.bonstickSrc = `assets/images/user-bonsticks/${avatarSrc}`
    })
  }


  showAvatar(event: Event) {
    this.isShown = true

    const target = event.target as HTMLElement;
    const tag = target.dataset['tag'] as keyof typeof bonstickPositions
    this.bonstickPos = bonstickPositions[tag] ?? bonstickPositions.solar;

    this.bonstick?.nativeElement.classList.add('active') 
    // this.activeTimeout = setTimeout(() => {
    //   this.bonstick?.nativeElement.classList.add('active') 
    // }, 200);
    
      // if(avatar.getAttribute('src')) {
      //   const select = document.querySelector('.select-games');

      //   avatar.style.width = 160 + "px";
      //   avatar.style.height = 190 + "px";
      //   avatar.style.position = 'absolute'
      //   avatar.style.zIndex = "100";

      //   avatar.style.left = event.target.offsetLeft  + event.target.clientWidth/2 - 160/2  + "px";
      //   avatar.style.top = event.target.offsetTop - 190/2 + "px";
      //   avatar.style.cursor = "pointer";
        
      //   select!.append(avatar);
      // }
  }

  hideAvatar(event: any) {
    this.isShown = false;
    clearTimeout(this.activeTimeout);
    this.bonstick?.nativeElement.classList.remove('active')
  }
}
