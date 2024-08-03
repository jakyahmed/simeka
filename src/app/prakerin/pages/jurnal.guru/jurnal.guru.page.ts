import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-jurnal.guru',
  templateUrl: './jurnal.guru.page.html',
  styleUrls: ['./jurnal.guru.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class JurnalGuruPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
