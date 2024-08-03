import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-detail.jurnal',
  templateUrl: './detail.jurnal.page.html',
  styleUrls: ['./detail.jurnal.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class DetailJurnalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
