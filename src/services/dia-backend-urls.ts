import { Injectable } from '@angular/core';

@Injectable()
export class DiaBackendURL {
  private apiHostLocal = 'http://127.0.0.1:8000';
  private apiHostPreProduction = 'https://api-test.diamobile.com';
  private apiHostProduction = 'https://api.diamobile.com';
  
  private apiWSHostLocal = 'ws://127.0.0.1:8000';
  private apiWSHostPreProduction = 'wss://api-test.diamobile.com';
  private apiWSHostProduction = 'wss://api.diamobile.com';

  // Change this line for production
  public baseURL = this.apiHostLocal;
  public wsBaseURL = this.apiWSHostLocal;

  constructor() {}
}