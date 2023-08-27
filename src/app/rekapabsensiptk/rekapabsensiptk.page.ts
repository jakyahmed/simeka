import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GlobalService } from '../services/global.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-rekapabsensiptk',
  templateUrl: './rekapabsensiptk.page.html',
  styleUrls: ['./rekapabsensiptk.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class RekapabsensiptkPage implements OnInit {
  myDate: String = new Date().toISOString();
  isToastOpen: boolean = false;
  dataRekap: any = [];
  dataByname: any = [];
  mode: string = '';
  ketmode: string = '';
  host=new GlobalService().base_url;
  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  ionViewDidLeave() {
    this.dataRekap = [];
    this.mode = '';
    this.ketmode = '';
  }

  showHari(e: any) {
    this.dataRekap = [];
    this.dataByname=[];
    if (e.detail.value) {
      let date: string;
      date = formatDate(e.detail.value, 'yyyy-MM-dd', 'en-US');
      this.http
        .get<any[]>(
          `${this.host}simeka/index.php/ptkapi/rekap/harian/` +
            encodeURI(date)
        )
        .pipe(
          tap((response) => {
            this.dataRekap = response;
            this.mode = 'Harian';
            this.ketmode = date;
            if (response == null) {
              this.isToastOpen = true;
            }
            console.log(response);
          })
        )
        .subscribe();
    }
    console.log(e);
  }

  showBulan(e: any) {
    this.dataRekap = [];
    this.dataByname=[];
    let tanggal: string;
    if (e.detail.value) {
      tanggal = e.detail.value;
    } else {
      tanggal = new Date().toISOString();
    }

    let date: string;
    date = formatDate(tanggal, 'yyyy-MM', 'en-US');
    this.http
      .get<any[]>(
        `${this.host}simeka/index.php/ptkapi/rekap/bulanan/` +
          encodeURI(date)
      )
      .pipe(
        tap((response) => {
          this.dataRekap = response;
          this.mode = 'Bulanan';
          this.ketmode = date;
          if (response == null) {
            this.isToastOpen = true;
          }
          console.log(response);
        })
      )
      .subscribe();
    console.log(e);
  }

  setOpen(b: boolean) {
    this.isToastOpen = b;
  }

  ganjil() {
    this.dataRekap=[];
    this.dataByname=[];
    this.http
      .get<any[]>(
        `${this.host}simeka/index.php/ptkapi/rekap/semester/ganjil`
      )
      .pipe(
        tap((response) => {
          this.dataRekap = response;
          this.mode = 'Semester';
          this.ketmode = 'Ganjil';
          if (response == null) {
            this.isToastOpen = true;
          }
          console.log(response);
        })
      )
      .subscribe();
  }

  genap() {
    this.dataRekap=[];
    this.dataByname=[];
    this.http
      .get<any[]>(
        `${this.host}simeka/index.php/ptkapi/rekap/semester/genap`
      )
      .pipe(
        tap((response) => {
          this.dataRekap = response;
          this.mode = 'Semester';
          this.ketmode = 'Genap';
          if (response == null) {
            this.isToastOpen = true;
          }
          console.log(response);
        })
      )
      .subscribe();
  }

  byname(mode: string, tgl: string) {
    this.http
      .get<any[]>(
        `${this.host}simeka/index.php/ptkapi/byname/` +
          mode +
          '/' +
          tgl
      )
      .pipe(
        tap((response) => {
          this.dataByname = response;
          if (response == null) {
            this.isToastOpen = true;
          }
          console.log(response);
        })
      )
      .subscribe();
  }
}
