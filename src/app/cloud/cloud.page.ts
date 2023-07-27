import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpClientModule,
  HttpEventType,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';

interface FileInfo {
  name: string;
  size: number;
  type: string;
  // Add more properties here as needed, such as date, URL, etc.
}

@Component({
  selector: 'app-cloud',
  templateUrl: './cloud.page.html',
  styleUrls: ['./cloud.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HttpClientModule],
})
export class CloudPage implements OnInit {
  username: string = '';
  selectedFile: File | null = null;
  progress: number = 0;
  id_user: string = '';
  fileList: FileInfo[] = [];

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.auth.isLoggedIn().subscribe((isLogin) => {
      if (!isLogin) {
        this.router.navigate(['/login'], {
          queryParams: { redir: '/main/tabs/cloud' },
        });
        console.log('login: ' + isLogin);
      }
    });

    this.auth.getUserdata().subscribe((data) => {
      console.log(data);
      if (data) {
        this.username = data.full_name;
        this.id_user = data.id_users;
        console.log(this.username);
        if (data.id_user_level !== '1') {
          this.router.navigate(['/main/tabs/home']);
        }
      }
    });

    this.fetchFileListFromServer();
  }

  ngOnInit() {}

  onFileChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.selectedFile = inputElement.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onUpload() {
    if (this.selectedFile) {
      const uploadData = new FormData();
      uploadData.append('file', this.selectedFile, this.selectedFile.name);
      uploadData.append('id_user', this.id_user);

      this.http
        .post('http://localhost/simeka/index.php/fileapi/upload', uploadData, {
          reportProgress: true,
          observe: 'events',
        })
        .subscribe((event) => {
          if (event.type === HttpEventType.UploadProgress) {
            if (event.total !== undefined) {
              this.progress = Math.round((100 * event.loaded) / event.total);
            }
          } else if (event.type === HttpEventType.Response) {
            // File uploaded successfully
            this.selectedFile = null;
            console.log(event.body);
            this.fetchFileListFromServer();
          }
        });
    }
  }

  private fetchFileListFromServer() {
    this.fileList = [];
    // Assuming your server returns the list of files in JSON format
    this.http
      .get<FileInfo[]>('http://localhost/simeka/index.php/fileapi/listfile/'+this.id_user)
      .pipe(
        tap((fileList) => {
          this.fileList = fileList;
        })
      )
      .subscribe();
  }
  // Function to format file size for display
  formatFileSize(size: number): string {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
