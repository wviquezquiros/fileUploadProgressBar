import { Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { AWS_URL } from '../api.token';

export interface Draft {
  fileName: string;
  lastModified: string;
}

@Injectable({ providedIn: 'root' })
export class S3BucketService {
  progress: number = 0;

  constructor(
    private https: HttpClient,
    @Inject(AWS_URL) private uri: string
  ) {}

  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.https
      .post('https://uhswebrequestform.com/aws/uploadFile', formData, {
        reportProgress: true,
        observe: 'events',
        responseType: 'text',
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            this.progress = Math.round((100 / event.total) * event.loaded);
          } else if (event.type == HttpEventType.Response) {
            this.progress = 0;
          }
        }),
        catchError((err: any) => {
          this.progress = 0;
          alert(err.message);
          return throwError(err.message);
        })
      )
      .toPromise();
  }
}
