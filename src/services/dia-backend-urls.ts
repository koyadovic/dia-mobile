import { Injectable } from '@angular/core';

@Injectable()
export class DiaBackendURL {
  private apiHostDevelopment = '127.0.0.1:8000';
  private apiHostProduction = 'api.diamobile.com';

  // for production this will need to be changed too
  // private defaultSchema = "https://"
  // private defaultWebsocketsSchema = "wss://"
  private defaultSchema = "http://"
  private defaultWebsocketsSchema = "ws://"

  // Change this line for production
  private apiHost = this.apiHostDevelopment;
    
  public baseURL = this.defaultSchema + this.apiHost;
  public wsBaseURL = this.defaultWebsocketsSchema + this.apiHost;

  constructor() {}
}