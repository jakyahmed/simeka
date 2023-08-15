import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import {
  HttpClient,
  HttpClientModule,
  HttpEventType,
} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { GlobalService } from '../services/global.service';

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
  host = new GlobalService().base_url;

  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient,
    private actionSheetController: ActionSheetController
  ) {}

  cekLogin() {
    this.auth
      .isLoggedIn()
      .pipe(
        tap((isLogin) => {
          if (isLogin == false) {
            this.router.navigate(['/login'], {
              queryParams: { redir: '/main/tabs/cloud' },
              replaceUrl: true,
              skipLocationChange: true,
            });
            console.log('login: ' + isLogin);
          }
        })
      )
      .subscribe();

    this.auth
      .getUserdata()
      .pipe(
        tap((data) => {
          console.log(data);
          if (data !== null) {
            this.username = data.full_name;
            this.id_user = data.id_users;
            console.log(this.username);
            if (data.id_user_level == '1' || data.id_user_level == '2') {
            } else {
              this.router.navigate(['/main/tabs/home']);
            }
          }
        })
      )
      .subscribe();
  }

  ionViewWillEnter() {
    this.cekLogin();
    console.log('cek login');
  }
  ionViewDidEnter() {
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
        .post(`${this.host}simeka/index.php/fileapi/upload`, uploadData, {
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
      .get<FileInfo[]>(
        `${this.host}simeka/index.php/fileapi/listfile/` + this.id_user
      )
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

  ionViewDidLeave() {
    console.log('leave');
  }

  async openActionSheet(filename: string) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Download',
          handler: () => {
            this.processAction('Download', filename);
          },
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.processAction('Delete', filename);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    await actionSheet.present();
  }

  processAction(action: string, filename: string) {
    console.log(`Performed action: ${action} on item with ID: ${filename}`);
    switch (action) {
      case 'Download':
        this.downloadFile(filename);
        break;

      case 'Delete':
        this.deleteFile(filename);
        break;

      default:
        break;
    }
  }

  downloadFile(file: string) {
    const link = document.createElement('a');
    link.href = `${this.host}/simeka/uploads/${this.id_user}/${file}`;
    link.target = '_blank';
    // link.download = file;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  deleteFile(file: string) {
    const postData = new FormData();
    postData.append('file', file);
    postData.append('id_user', this.id_user);
    this.http
      .post(`${this.host}simeka/index.php/fileapi/delete`, postData)
      .subscribe({
        next: () => {
          this.reloadPage();
          console.log('next');
        },
        error: () => {
          console.log('error');
        },
        complete: () => {
          console.log('complete');
        },
      });
  }

  reloadPage() {
    console.log('reload');
    window.location.reload();
  }
}
