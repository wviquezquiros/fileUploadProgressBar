import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { catchError, map, throwError, lastValueFrom } from 'rxjs';

export interface Draft {
  fileName: string;
  lastModified: string;
}

@Injectable({ providedIn: 'root' })
export class S3BucketService {
  progress: number = 0;

  constructor(private https: HttpClient) {}

  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return lastValueFrom(
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
              this.progress = null;
            }
          }),
          catchError((err: any) => {
            //this.progress = 0;
            //alert(err.message);
            return throwError(err.message);
          })
        )
    );
  }
}
