import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QhanaPluginService {
  isPlugin: boolean = false;

  constructor(private http: HttpClient) {
    this.isPlugin = window.top !== window.self;
  }
}
