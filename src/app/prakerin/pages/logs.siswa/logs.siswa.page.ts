import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-logs.siswa',
  templateUrl: './logs.siswa.page.html',
  styleUrls: ['./logs.siswa.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LogsSiswaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
