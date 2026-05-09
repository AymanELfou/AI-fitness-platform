import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _premiumNotification = new BehaviorSubject<boolean>(false);
  premiumNotification$ = this._premiumNotification.asObservable();

  showPremiumNotification() {
    this._premiumNotification.next(true);
  }

  hidePremiumNotification() {
    this._premiumNotification.next(false);
  }
}
