import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { lastValueFrom, tap } from 'rxjs';

@Component({
  selector: 'app-prakerin.home',
  templateUrl: './prakerin.home.page.html',
  styleUrls: ['./prakerin.home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PrakerinHomePage implements OnInit {

  constructor(private nav: NavController,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  cekLogin() {
    this.auth.isLoggedIn().pipe(
      tap((isLogin) => {
        if (!isLogin) {
          this.router.navigate(['/login'], {
            queryParams: { redir: '/main/tabs/prakerin' },
            replaceUrl: true,
            skipLocationChange: true,
          });
          console.log('login: ' + isLogin);
        }
      })
    );
  }

  ionViewWillEnter() {
    this.cekLogin();
  }
  gotoJurnalGuru() {
    this.nav.navigateForward("/tabs/prakerin/jurnalguru");
  }

  gotoJurnal() {
    this.nav.navigateForward("/tabs/prakerin/jurnal");
  }

  gotoPresensi() {
    this.nav.navigateForward("/tabs/prakerin/presensi");
  }

  gotoReset() {
    this.nav.navigateForward("/tabs/prakerin/reset");
  }

  gotoLog() {
    this.nav.navigateForward("/tabs/prakerin/logs");
  }
}
