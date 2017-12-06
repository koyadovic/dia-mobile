import { Injectable } from '@angular/core';

@Injectable()
export class DiaBackendURL {
  private apiBaseURLDevelopment = 'http://127.0.0.1:8000';
  private apiBaseURLProduction = 'https://api.diamobile.com';

  public baseURL = this.apiBaseURLDevelopment;
  //private baseURL = this.apiBaseURLProduction;

  constructor() {}
}