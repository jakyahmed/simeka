import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PrakerinServiceService } from 'src/app/services/prakerin.service.service';
// for export table
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-detail.presensi',
  templateUrl: './detail.presensi.page.html',
  styleUrls: ['./detail.presensi.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class DetailPresensiPage implements OnInit {
  id: string | null = null;
  nama:string|null=null;
  bulan = new Date().getMonth() + 1;
  host = new PrakerinServiceService().prakerin_url;
  datapresensi: any = [];
  holidays:any=[];
  displayPresensi:any=[];
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

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.nama=params['nama'];
    })
  }

  ionViewDidEnter(){
   this.bulan=new Date().getMonth()+1;
   this.getPresensi();
  }

  getPresensi() {
    if (this.id != null) {
      this.http.post(`${this.host}jurnal.php`, { student_id: this.id, month: this.bulan }, { headers: { "Content-Type": "application/json" } })
        .subscribe({
          next: (value) => {
            let data:any=value;
            this.datapresensi = data.presensi;
            this.holidays=data.holidays;
            this.displayPresensi=this.formattedItems();
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
      const foundItem = this.datapresensi.find((item: { date: string | number | Date; }) => this.formatLocalDate(new Date(item.date)) === localDate);

      if (isSunday || isHoliday) {
        status = 'Libur';
      } else if (foundItem) {
        status = 'Presensi';
      } else if (date < new Date()) {
        status = '-';
      }

      dates.push({
        date: date,
        formattedDate: this.formatDate(date),
        status: foundItem ? 'Presensi' : status,
        activity_description: foundItem ? foundItem.activity_description : '',
        photo_url: foundItem ? foundItem.photo_url : '',
        time: foundItem ? this.formatTime(foundItem.attendance_time):''
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
