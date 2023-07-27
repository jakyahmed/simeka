import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabhome',
  templateUrl: './tabhome.page.html',
  styleUrls: ['./tabhome.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class TabhomePage implements OnInit {
  isLogin: boolean = false;
  username:string='';

  constructor(private router: Router, private auth: AuthService, private nav:NavController) {
    this.auth.isLoggedIn().subscribe((val) => {
      this.isLogin = val;
    });

    this.auth.getUserdata().subscribe((val)=>{
      this.username=val.email;
    })
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
   
  }
  
  gotoAbsensi() {
    // this.router.navigate(['main/tabs/absensi']);
    this.nav.navigateForward('main/tabs/absensi');
  }
  gotoRekapAbsensi() {
    // this.router.navigate(['main/tabs/rekapabsensi']);
    this.nav.navigateForward('main/tabs/absensi');
  }

  gotoCloud(){
    this.nav.navigateForward('main/tabs/cloud');
  }

  logout() {
    this.auth.setLoggedInStatus(false);
    this.auth.removeUserdata();
    this.isLogin=false;
  }
}