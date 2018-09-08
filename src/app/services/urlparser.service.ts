import { Injectable } from '@angular/core';
import { FileuploadService } from './fileupload.service';
import { Utility } from '../Shared/Utility';
import { Observable } from '../../../node_modules/rxjs';

@Injectable()
export class UrlparserService {

  constructor(private fsservice: FileuploadService ) { }

  GetFileURL(filename: string, type: string): Observable<string> {
    return this.fsservice.GenerateFile(filename).map(status => {
      return Utility.getFileURL(filename, type, status[0]);
    });
  }
}
