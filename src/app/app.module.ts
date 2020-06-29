import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { GlobalErrorHandlerProvider } from '@app/interceptors/error/error-interceptor.provider';
import { GlobalHttpInterceptorProvider } from '@app/interceptors/http/http-interceptor.provider';
import { ErrorInterceptorProvider } from '@app/interceptors/http2.interceptor';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [GlobalErrorHandlerProvider, GlobalHttpInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
