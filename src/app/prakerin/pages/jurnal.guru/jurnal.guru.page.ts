import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { PrakerinServiceService } from 'src/app/services/prakerin.service.service';
import { Router } from '@angular/router';

// for export table
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-jurnal.guru',
  templateUrl: './jurnal.guru.page.html',
  styleUrls: ['./jurnal.guru.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class JurnalGuruPage implements OnInit {
  date = formatDate(new Date().toISOString(), "yyyy-MM-dd HH:mm:ss", "en-US");
  bulan = new Date().getMonth() + 1;
  bulans = [
    { id: 1, name: "Januari" },
    { id: 2, name: "Februari" },
    { id: 3, name: "Maret" },
    { id: 4, name: "April" },
    { id: 5, name: "Mei" },
    { id: 6, name: "Juni" },
    { id: 7, name: "Juli" },
    { id: 8, name: "Agustus" },
    { id: 9, name: "September" },
    { id: 10, name: "Oktober" },
    { id: 11, name: "November" },
    { id: 12, name: "Desember" },
  ];

  dataJurnal: any = [];
  userData: any = [];
  host = new PrakerinServiceService().prakerin_url;
  uraian="";
  siswa="";

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.auth.isLoggedIn().subscribe((isLogin) => {
      console.log('isLogin:', isLogin);  // Logging nilai isLogin
      if (isLogin) {
        this.auth.getUserdata().subscribe((userdata) => {
          this.userData = userdata;
          console.log('userdata:', this.userData);  // Logging userData
          this.http.post(`${this.host}admin-api/jurnalguru.php`, { mode: 'updateguru', guruid: this.userData.id_users, nama: this.userData.full_name }, { headers: { "Content-Type": "application/json" } })
            .subscribe((res) => {
              console.log('Response from API:', res);  // Logging response dari API
            });
        })
      } else {
        console.log('Navigating to login...');  // Logging saat navigasi ke halaman login
        this.router.navigate(['/login'], {
          queryParams: { redir: '/tabs/prakerin/jurnalguru' },
          replaceUrl: true,
          skipLocationChange: true,
        });
      }
    });
  }


  ionViewDidEnter() {
    this.getJurnal();
    console.log(formatDate(this.date,"yyyy-MM-dd HH:mm:ss","en-US"));
    
  }

  getJurnal() {
    this.http.post(`${this.host}admin-api/jurnalguru.php`, { mode: 'getjurnal', guruid: this.userData.id_users }, { headers: { "Content-Type": "application/json" } })
      .subscribe((res) => {
        this.dataJurnal = res
        console.log(this.dataJurnal);

      });
  }

  setWaktu(e:any){
    if(e.detail.value){
      this.date = formatDate(e.detail.value, 'yyyy-MM-dd HH:mm:ss', 'en-US');
      console.log(this.date);
    }
  }

  sendJurnal(){
    this.http.post(`${this.host}admin-api/jurnalguru.php`, { mode: 'setjurnal', guruid: this.userData.id_users,date:this.date,uraian:this.uraian,siswa:this.siswa }, { headers: { "Content-Type": "application/json" } })
      .subscribe((res) => {
        console.log(this.dataJurnal);
        this.getJurnal();
      });
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('table-data'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Rekap_Presensi_${this.userData.full_name}_${this.bulan}.xlsx`);
  }
}
