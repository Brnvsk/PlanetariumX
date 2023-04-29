import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForwardsService {


  public cardMemory: boolean = false;

  private _seconds$: BehaviorSubject<number> = new BehaviorSubject<number>(3);
  private seconds: number = 3;
  get seconds$() {
    return this._seconds$.asObservable();
  }
  constructor(
    private router: Router
  ) { }

  change() {
    let time = setInterval(() => {
      this._seconds$.next(--this.seconds);
      if(this.seconds === 0) clearInterval(time);
    }, 1000)
  }

  setCustomValue() {
    this._seconds$.next(3);
    this.seconds = 3;
  }

  forwardSession(activatedRoute: ActivatedRoute) {
    activatedRoute.parent ? this.router.navigate(['sessions'], {relativeTo: activatedRoute.parent})
    : this.router.navigate(['app/sessions']);
  }

  forwardView() {
    this.router.navigate(['app']);
  }

  forwardContacts(activatedRoute: ActivatedRoute) {
    activatedRoute.parent ? this.router.navigate(['abousUs'], {relativeTo: activatedRoute.parent})
    : this.router.navigate(['app/aboutUs']);
  }

  forwardNews(activatedRoute: ActivatedRoute) {
    activatedRoute.parent ? this.router.navigate(['news'], {relativeTo: activatedRoute.parent})
    : this.router.navigate(['app/news']);
  }

  forwardGames(activatedRoute?: ActivatedRoute) {

    activatedRoute?.parent ? this.router.navigate(['games'], {relativeTo: activatedRoute.parent})
    : this.router.navigate(['app/games']);
  }
  forwardSolarGame(router: Router) {
    this.router.navigate([`${router.url}/solarSystem`]);
  }
  forwardBarleyGame(router: Router) {
    this.router.navigate([`${router.url}/barleyBreak`]);
  }
  forwardMemoryGame(router: Router) {
    this.router.navigate([`${router.url}/cardMemory`]);
  }
  forwardLearningGame(router: Router) {
    this.router.navigate([`${router.url}/learningPlanets`]);
  }
  forwardSpyGame(router: Router) {
    this.router.navigate([`${router.url}/spy`]);
  }

}
