import { Injectable } from '@angular/core';
import { FileuploadService } from './fileupload.service';
import { Observable } from '../../../node_modules/rxjs';
import { Urlutility } from '../Shared/urlutility';
import { Utility } from '../Shared/Utility';


@Injectable()
export class UrlparserService {

  constructor(private fsservice: FileuploadService ) { }

  GetFileURL(filename: string, type: string): Observable<string> {
    if (Utility.isNotEmptyNullUndefined(filename)) {
      return this.fsservice.GenerateFile(filename).map(status => {
        return Urlutility.getFileURL(filename, type, status[0]);
      });
    } else {
      return Observable.of(Urlutility.getFileURL(filename, type, false));
    }
  }
}
