import { Injectable } from '@angular/core';

function _window(): any {
  // return the global native browser window object
  return window;
}

export class StorageKeys {
  public static AUTH_SESSION = 'auth-session';
  public static TOKEN_INFO = 'token-info';
  public static USER_INFO = 'user-info';
  public static USER_DETAILS = '';
  public static USER_SETTINGS = '';
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  public static getItem(key: string): string | null {
    return _window().localStorage.getItem(key);
  }

  public static setItem(key: string, value: any): void {
    return _window().localStorage.setItem(key, value);
  }

  public static removeItem(key: string): void {
    return _window().localStorage.removeItem(key);
  }

}
