import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { GlobalService } from '../services/global.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonicModule,CommonModule, ExploreContainerComponent, HttpClientModule],
})
export class Tab2Page {
  host = new GlobalService().base_url;
  info: any = [];

  constructor(private http: HttpClient) {
    this.loadData();
  }

  loadData() {
    this.info = [];
    this.http
      .get<any[]>(`${this.host}simeka/index.php/infobkkapi/api`)
      .pipe(
        tap((response) => {
          this.info = response;
          console.log(response);
        })
      )
      .subscribe();
  }
}
