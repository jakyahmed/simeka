import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GlobalService } from '../services/global.service';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presensiptk',
  templateUrl: './presensiptk.page.html',
  styleUrls: ['./presensiptk.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class PresensiptkPage implements OnInit {
  dataLoaded: boolean = false;
  dataPTK: any = [];
  myDate = new Date();
  isToastOpen: boolean = false;
  username: string = '';
  host = new GlobalService().base_url;
  constructor(private http: HttpClient, private router:Router) {}

  ngOnInit() {
    this.dataPTK.data = [];
    this.loadData();
  }

  loadData() {
    this.http
      .get<any[]>(
        `${this.host}simeka/index.php/ptkapi/api`
      ) //${this.selectedOption}
      .pipe(
        tap((response) => {
          this.dataPTK = response;
          if (this.dataPTK.prefil) {
            this.dataLoaded = false;
          } else {
            this.dataLoaded = true;
          }
          console.log(this.dataPTK);
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

    let postData = this.dataPTK.data.map(
      (item: { id: any; kehadiran: any }) => ({
        id_ptk: item.id,
        kehadiran: item.kehadiran,
        operator: this.username,
      })
    );

    console.log(postData);
    var that = this;
    this.http
      .post(`${this.host}simeka/index.php/ptkapi/post`, postData, {
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
      this.goRekapPTK();
    }
  }
  goRekapPTK() {
    this.router.navigate(['/main/tabs/rekapabsensiptk']);
  }
}
