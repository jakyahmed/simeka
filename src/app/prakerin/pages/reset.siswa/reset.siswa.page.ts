import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonicModule } from '@ionic/angular';
import { PrakerinServiceService } from 'src/app/services/prakerin.service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-reset.siswa',
  templateUrl: './reset.siswa.page.html',
  styleUrls: ['./reset.siswa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule]
})
export class ResetSiswaPage implements OnInit {
  host = new PrakerinServiceService().prakerin_url;
  dataSiswa: any = [];
  filteredSiswa: any = [];
  query = "";
  toast: any = [];


  constructor(private http: HttpClient, private alertController: AlertController) { }
  isToastOpen = false;

  setOpen(isOpen: boolean) {
    this.isToastOpen = isOpen;
  }

  ngOnInit() {
    // this.searchData();
  }

  ionViewDidEnter() {
    this.searchData();
  }

  async resetLogin(siswaid: any) {
    const alert = await this.alertController.create({
      header: 'Konfirmasi',
      message: 'Apakah Anda yakin ingin mereset login siswa ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Ya',
          handler: async () => {
            // Tambahkan logika reset login di sini
            this.http.post(`${this.host}admin-api/resetsiswa.php`, { siswaid: siswaid }, { headers: { "Content-Type": "application/json" } })
              .subscribe({
                next: (value) => {
                  this.toast = value
                  this.setOpen(true);
                }
              });
            console.log('Login reset for siswa id:', siswaid);
            // Misalnya, Anda bisa menambahkan panggilan API untuk reset login di sini
          }
        }
      ]
    });

    await alert.present();
    console.log(siswaid);

  }

  async resetCode(siswaid: any) {
    const alertctrl = await this.alertController.create({
      header: 'Konfirmasi',
      message: 'Berikan 5-digit code untuk siswa sebagai kode login.',
      inputs: [{name:"kode",placeholder:"kode",type:"number"}],
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
        },
        {
          text: 'Ya',
          handler: async (data) => {
            // Tambahkan logika reset login di sini
            let kode:number=data.kode;
            console.log(data);
            
            if(kode.toString().length>=5){
              this.http.post(`${this.host}admin-api/resetsiswa.php`, { siswaid: siswaid, kode: kode }, { headers: { "Content-Type": "application/json" } })
                .subscribe({
                  next: (value) => {
                    this.toast = value
                    this.setOpen(true);
                  }
                });
              console.log('Login reset for siswa id:', siswaid);
            }else{
              this.toast.pesan="Kode kurang dari 5 digit."
              this.setOpen(true);
            }
            // Misalnya, Anda bisa menambahkan panggilan API untuk reset login di sini
          }
        }
      ]
    });

    await alertctrl.present();
    console.log(siswaid);

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


}
