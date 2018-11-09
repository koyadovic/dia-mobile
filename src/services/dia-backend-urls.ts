import { Injectable } from '@angular/core';

@Injectable()
export class DiaBackendURL {
  private apiHostLocal = 'http://127.0.0.1:8000';
  private apiHostPreProduction = 'https://api-test.diamobile.com';
  private apiHostProduction = 'https://api.diamobile.com';
  
  // Change this line for production
  public baseURL = this.apiHostLocal;

  constructor() {}
}
