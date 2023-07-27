import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private userData= new BehaviorSubject<any>([]);


  constructor(private storage: Storage) {
    this.loadLoginStatus();
  }

  private async loadLoginStatus() {
    const isLoggedIn = await this.storage.get('loggedInUser');
    this.loggedIn.next(!!isLoggedIn);
    const userdata=await this.storage.get('userdata');
    this.userData.next(userdata);
  }

  // Call this method to set the login status
  setLoggedInStatus(isLoggedIn: boolean) {
    this.loggedIn.next(isLoggedIn);
    if (isLoggedIn) {
      // Store the login status in Ionic Storage
      this.storage.set('loggedInUser', true);
    } else {
      // Remove the login status from Ionic Storage
      this.storage.remove('loggedInUser');
    }
  }

  setUserdata(data:any){
    this.userData.next(data);
  }

  removeUserdata(){
    this.userData.next('');
    this.storage.remove('userdata');
  }

  // Use this method to get the login status as an Observable
  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  getUserdata(){
    return this.userData.asObservable();
  }
}
