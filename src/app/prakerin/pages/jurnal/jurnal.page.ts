import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { PrakerinServiceService } from 'src/app/services/prakerin.service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-jurnal',
  templateUrl: './jurnal.page.html',
  styleUrls: ['./jurnal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,HttpClientModule]
})
export class JurnalPage implements OnInit {

  host = new PrakerinServiceService().prakerin_url;
  dataSiswa: any = [];
  filteredSiswa: any = [];
  query = "";
  pinnedSiswa: any = [];

  constructor(private http:HttpClient, private nav:NavController, private storage:Storage) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.searchData();
    this.loadPinnedSiswa();
  }

  searchData() {
    this.http.post(`${this.host}admin-api/resetsiswa.php`, null, { headers: { "Content-Type": "application/json" } })
      .subscribe({
        next: (value) => {
          this.dataSiswa = value;
          this.filterData(); // Panggil filterData setelah data diterima
        }
      })
  }

  filterData() {
    if (this.query.trim() === "") {
      this.filteredSiswa = this.dataSiswa;
    } else {
      this.filteredSiswa = this.dataSiswa.filter((siswa: any) =>
        siswa.name.toLowerCase().includes(this.query.toLowerCase())
      );
    }
  }

  openJurnal(siswaid: string, name: string) {
    this.nav.navigateForward("/tabs/prakerin/detailjurnal",{queryParams:{id:siswaid, nama:name}});
  }

  async pin(siswa: any) {
    // Add siswa to pinned list if not already pinned
    const index = this.pinnedSiswa.findIndex((item: any) => item.id === siswa.id);
    if (index === -1) {
      this.pinnedSiswa.push(siswa);
      await this.storage.set('pinnedSiswa', this.pinnedSiswa);
    }
  }

  async unpin(siswa: any) {
    //hapus pin
    const index = this.pinnedSiswa.findIndex((item: any) => item.id === siswa.id);
    if (index !== -1) {
      this.pinnedSiswa.splice(index, 1);
      await this.storage.set('pinnedSiswa', this.pinnedSiswa);
    }
  }



  async loadPinnedSiswa() {
    this.pinnedSiswa = await this.storage.get('pinnedSiswa') || [];
  }
}
