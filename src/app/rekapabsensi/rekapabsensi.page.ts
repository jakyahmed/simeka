import { Component, OnInit } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { isEmpty, tap } from 'rxjs/operators';
import { GlobalService } from '../services/global.service';
// for export table
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-rekapabsensi',
  templateUrl: './rekapabsensi.page.html',
  styleUrls: ['./rekapabsensi.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class RekapabsensiPage implements OnInit {
  myDate: String = new Date().toISOString();
  isToastOpen: boolean = false;
  dataRekap: any = [];
  dataByname: any = [];
  mode: string = '';
  ketmode: string = '';
  host=new GlobalService().base_url;
  kelasaktif:string='';

  constructor(private http: HttpClient) {}

  ngOnInit() {}

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
          `${this.host}simeka/index.php/siswaapi/rekap/harian/` +
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
        `${this.host}simeka/index.php/siswaapi/rekap/bulanan/` +
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
        `${this.host}simeka/index.php/siswaapi/rekap/semester/ganjil`
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
        `${this.host}simeka/index.php/siswaapi/rekap/semester/genap`
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

  byname(mode: string, kelas: string, tgl: string) {
    this.http
      .get<any[]>(
        `${this.host}simeka/index.php/siswaapi/byname/` +
          mode +
          '/' +
          kelas +
          '/' +
          tgl
      )
      .pipe(
        tap((response) => {
          this.dataByname = response;
          this.kelasaktif=kelas;
          if (response == null) {
            this.isToastOpen = true;
          }
          console.log(response);
        })
      )
      .subscribe();
  }


  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('table-data'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Rekap_Presensi.xlsx');
  }

  exportToPDF() {
    const doc = new jsPDF();
    doc.text('Rekapitulasi Presensi Online', 14, 16);
    doc.text('Praktik Kerja Lapangan (PKL)', 14, 22);
    doc.text('SMK Negeri 1 Kalibawang', 14, 28);

    const table = document.getElementById('table-data')?.getElementsByTagName('table')[0];
    const rows = table?.querySelectorAll('tr');
    const data: any[] = [];

    rows?.forEach(row => {
      const rowData: any[] = [];
      row.querySelectorAll('th, td').forEach(cell => rowData.push(cell.textContent));
      data.push(rowData);
    });

    (doc as any).autoTable({
      head: [data[0], data[1]],
      body: data.slice(2),
      startY: 40, // Adjust start position for the table
      theme: 'striped', // Optional: add theme to table for better styling
      styles: {
        fontSize: 8, // Adjust font size
        cellPadding: 2, // Adjust cell padding
      },
      columnStyles: {
        0: { cellWidth: 10 }, // No
        1: { cellWidth: 30 }, // Nama
        2: { cellWidth: 20 }, // Bulan 7
        3: { cellWidth: 20 }, // Bulan 8
        4: { cellWidth: 20 }, // Bulan 9
        5: { cellWidth: 20 }, // Bulan 10
        6: { cellWidth: 20 }, // Bulan 11
        7: { cellWidth: 20 }, // Bulan 12
      },
      margin: { top: 40 }, // Adjust the margin to ensure text is not overlapped
    });

    doc.save('Rekap_Presensi.pdf');
  }
}
