import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HttpClient,
  HttpClientModule,
  HttpHeaders,
} from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { AuthService } from '../services/auth.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  isLogin: boolean = false;
  numbersArray: number[] = [];
  redir: string = '/main/tabs/home';
  host=new GlobalService().base_url;
  isToastOpen:boolean=false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
    private route: ActivatedRoute,
    private auth:AuthService
  ) {
    for (let i = 1; i <= 400; i++) {
      this.numbersArray.push(i);
    }

    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if(params['redir']){
        this.redir = params['redir'];
      }else{
        this.redir='/main/tabs/home';
      }
    });
  }

  ngOnInit() {
   
  }

  login() {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Access-Control-Allow-Origin', '*');

    const postData = {
      username: this.username,
      password: this.password,
    };
    let that = this;
    this.http
      .post(`${this.host}simeka/index.php/loginapi/auth`, postData, {
        headers: headers,
      })
      .subscribe({
        next(response) {
          if (response) {
            that.storage.set('loggedInUser', true).then(() => {
              // Redirect the user to another page or perform any other actions after login.
              that.auth.setLoggedInStatus(true);
              that.auth.setUserdata(response);
              that.storage.set('userdata', response);
              that.router.navigate([that.redir]);
            });
          }else{
            that.setOpen(true);
          }
          console.log(response);
        },
      });

    // this.router.navigate(['/main/tabs/home']);
    // this.isLogin=true;
    // console.log(this.router);
  }

  setOpen(b:boolean){
    this.isToastOpen=b;
  }
}
