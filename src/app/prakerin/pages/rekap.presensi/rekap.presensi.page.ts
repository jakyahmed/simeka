import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PrakerinServiceService } from 'src/app/services/prakerin.service.service';
// for export table
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-rekap.presensi',
  templateUrl: './rekap.presensi.page.html',
  styleUrls: ['./rekap.presensi.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,HttpClientModule]
})
export class RekapPresensiPage implements OnInit {
dataSiswa:any=[];
filteredSiswa:any=[];
host=new PrakerinServiceService().prakerin_url;
kelass:any=[];
selectedKelas=0;
query="";

  constructor(private http:HttpClient,private nav:NavController) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
  this.getKelas()
  }

  getKelas() {
    this.http.post(`${this.host}kelas.php`, {dummy:1}, { headers: { "Content-Type": "application/json" } })
      .subscribe({
        next: (value) => {
          this.kelass = value;
        }
      })
  }

  loadSiswa(){
    this.getData(this.selectedKelas);
  }

  getData(kelas:any) {
    this.http.post(`${this.host}admin-api/rekappresensi.php`, {kelasid:kelas}, { headers: { "Content-Type": "application/json" } })
      .subscribe({
        next: (value) => {
          this.dataSiswa = value;
          this.filterNama(); // Panggil filterData setelah data diterima
          console.log(this.filteredSiswa);
        }
      })
  }

  filterNama(){
    if (this.query.trim() === "") {
      this.filteredSiswa = this.dataSiswa;
    } else {
      this.filteredSiswa = this.dataSiswa.filter((siswa: any) =>
        siswa.name.toLowerCase().includes(this.query.toLowerCase())
      );
    }
    
  }

  gotoDetail(id:string,nama:string){
    this.nav.navigateForward('/tabs/prakerin/detailpresensi',{queryParams:{id:id,nama:nama}});
  }

  exportToExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('table-data'));
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Rekap_Presensi.xlsx');
  }

  exportToPDF() {
    const doc = new jsPDF();
    // Fungsi untuk menambahkan header pada setiap halaman
    const header = (data: any) => {
      doc.setFontSize(10);
      doc.setFont("arial","italic");
      doc.text('Dicetak '+Date().toLocaleUpperCase('id-ID'), 14, 10);
    };

    // Fungsi untuk menambahkan footer pada setiap halaman
    const footer = (data: any) => {
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(`Page ${data.pageNumber} | autogenerate by SIM SMEKSAKA (https://sim.smkn1kalibawangwsb.sch.id/`, data.settings.margin.left, doc.internal.pageSize.height - 10);
    };

    doc.text('Rekapitulasi Presensi Online', 14, 18);
    doc.text('Praktik Kerja Lapangan (PKL)', 14, 24);
    doc.text('SMK Negeri 1 Kalibawang', 14, 30);
    const elkelas=document.getElementById('nama-kelas');
    const kelas=elkelas?elkelas.innerText:"";
    doc.text(kelas, 14, 34);
    doc.setFontSize(10);
    doc.html(elkelas?elkelas:"");
    // doc.text("autogenerate by SIM SMEKSAKA (https://sim.smkn1kalibawangwsb.sch.id/)", 14, 40);


    autoTable(doc,{html:"#main-table", startY:40, didDrawPage: function(data){
      header(data);
      footer(data);
    },margin:{top:50}});
    doc.save('Rekap_Presensi.pdf');
  }
}
