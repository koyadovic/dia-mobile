import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular/platform/platform';

@Injectable()
export class DiaBackendURL {
    private apiHostLocal = 'http://127.0.0.1:8000';
    private apiHostPreProduction = 'https://api-test.diamobile.com';
    private apiHostProduction = 'https://api.diamobile.com';
    
    // Change this line for production
    public baseURL = null;

    constructor(public platform: Platform) {
        if(this.isBrowser()) {
            this.baseURL = this.apiHostLocal;
        } else {
            this.baseURL = this.apiHostPreProduction;
        }
    }

    isBrowser() {
        return this.platform.is('core') || this.platform.is('mobileweb');
    }
}
