import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
// for export table
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { PrakerinServiceService } from 'src/app/services/prakerin.service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-detail.jurnal',
  templateUrl: './detail.jurnal.page.html',
  styleUrls: ['./detail.jurnal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class DetailJurnalPage implements OnInit {
  id: string | null = null;
  nama: string | null = null;
  host = new PrakerinServiceService().prakerin_url;
  datajurnal: any = [];
  holidays: any = [];
  displayJurnal: any = [];
  bulan = new Date().getMonth() + 1;
  bulans = [
    // { id: 1, name: "Januari" },
    // { id: 2, name: "Februari" },
    // { id: 3, name: "Maret" },
    // { id: 4, name: "April" },
    // { id: 5, name: "Mei" },
    // { id: 6, name: "Juni" },
    { id: 7, name: "Juli" },
    { id: 8, name: "Agustus" },
    { id: 9, name: "September" },
    { id: 10, name: "Oktober" },
    { id: 11, name: "November" },
    { id: 12, name: "Desember" },
  ];
  constructor(private http:HttpClient, private route:ActivatedRoute) { 
    this.route.queryParams.subscribe((params)=>{
      this.id=params['id'];
      this.nama=params['nama'];
    });
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
   this.getJurnal();
  }

  getJurnal(){
    if (this.id != null) {
      this.http.post(`${this.host}jurnalkegiatan.php`, { student_id: this.id, month: this.bulan }, { headers: { "Content-Type": "application/json" } })
        .subscribe({
          next: (value) => {
            let data: any = value;
            this.datajurnal = data.jurnal;
            this.holidays = data.holidays;
            this.displayJurnal = this.formattedItems();
            console.log(data);

          }
        })
    }
  }


  formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Intl.DateTimeFormat('id-ID', options).format(date);
  };

  formatTime(datetime: string): string {
    const date = new Date(datetime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  formatLocalDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  formattedItems = (() => {
    const daysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();
    const currentMonth = this.bulan;
    const currentYear = new Date().getFullYear();
    const totalDays = daysInMonth(currentMonth, currentYear);

    let dates = Array();
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth - 1, i);
      const day = date.getDay();
      const isSunday = day === 0;

      const localDate = this.formatLocalDate(date);
      const isHoliday = this.holidays.includes(localDate);
      // console.log("localDate:" + localDate);
      // console.log("isHoliday:" + isHoliday);

      let status = '-';
      const foundItem = this.datajurnal?.find((item: { date: string | number | Date; }) => this.formatLocalDate(new Date(item.date)) === localDate);

      if (isSunday || isHoliday) {
        status = 'Libur';
      } else if (foundItem) {
        status = 'Terisi';
      } else if (date < new Date()) {
        status = '-';
      }

      dates.push({
        date: date,
        formattedDate: this.formatDate(date),
        kegiatan: foundItem ? foundItem.kegiatan : status,
        hasil_kegiatan: foundItem ? foundItem.hasil_kegiatan : status,
      });
    }

    return dates;
  });
  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('table-data'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `Rekap_Presensi_${this.nama}_${this.bulan}.xlsx`);
  }
}
