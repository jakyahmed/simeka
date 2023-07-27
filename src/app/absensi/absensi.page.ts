import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-absensi',
  templateUrl: './absensi.page.html',
  styleUrls: ['./absensi.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class AbsensiPage implements OnInit {
  selectedOption: string = '';
  dataLoaded: boolean = false;
  dataSiswa: any = [];
  myDate = new Date();
  isToastOpen: boolean = false;
  username: string = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private auth: AuthService,
    private nav:NavController
  ) {
    this.auth.isLoggedIn().subscribe((isLogin) => {
      if (!isLogin) {
        this.router.navigate(['/login'], {
          queryParams: { redir: '/main/tabs/absensi' },
        });
        console.log('login: ' + isLogin);
      }
    });

    this.auth.getUserdata().subscribe((data) => {
      console.log(data);
      if (data) {
        this.username = data.full_name;
        console.log(this.username);
        if (data.id_user_level !== "1") {
          this.router.navigate(['/main/tabs/home']);
        }
      }
    });
  }

  ngOnInit() {
    this.dataSiswa.data = [];
  }

  ionViewDidEnter() {}

  ionViewDidLeave() {
    this.selectedOption = '';
    this.dataLoaded = false;
    this.dataSiswa = [];

  }

  loadData() {
    this.http
      .get<any[]>(
        `http://localhost/simeka/index.php/siswaapi/api/${encodeURI(
          this.selectedOption
        )}`
      ) //${this.selectedOption}
      .pipe(
        tap((response) => {
          this.dataSiswa = response;
          if (this.dataSiswa.prefil) {
            this.dataLoaded = false;
          } else {
            this.dataLoaded = true;
          }
          console.log(this.dataSiswa);
        })
      )
      .subscribe();

    // this.http.get<any[]>(`API_URL/${this.selectedOption}`).subscribe(
    //   (response) => {
    //     this.data = response;
    //     this.dataLoaded = true;
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }

  kirimAbsen() {
    // console.log(this.dataSiswa.data);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    let postData = this.dataSiswa.data.map(
      (item: { id: any; kehadiran: any }) => ({
        id_siswa: item.id,
        kehadiran: item.kehadiran,
        operator: this.username,
      })
    );

    console.log(postData);
    var that = this;
    this.http
      .post('http://localhost/simeka/index.php/siswaapi/post', postData, {
        headers: headers,
      })
      .subscribe({
        next(value) {
          let info: any = [];
          info = value;
          if (info.status) {
            that.isToastOpen = true;
          }
          console.log(value);
        },
        error(err) {
          console.log(err);
        },
        complete() {
          console.info('complete');
        },
      });
  }

  showTable() {
    this.dataLoaded = true;
  }

  setOpen(b: boolean) {
    this.isToastOpen = b;
    if (!b) {
      this.goRekap();
    }
  }
  goRekap() {
    this.router.navigate(['/main/tabs/rekapabsensi']);
  }
}
