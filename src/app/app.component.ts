import { Component } from '@angular/core';
import {
  HttpClient,
  HttpEventType,
  HttpErrorResponse,
} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  progress: number;
  constructor(private http: HttpClient) {}

  upload(event: any) {
    let file: any = event.target.files[0];

    this.progress = 1;
    const formData = new FormData();
    formData.append('file', file);
    this.http
      .post('https://uhswebrequestform.com/uhs/aws/uploadFile', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.progress = null;
          }
        }),
        catchError((err: any) => {
          this.progress = 100;
          //alert(err.message);
          return throwError(err.message);
        })
      )
      .toPromise();
  }
}
