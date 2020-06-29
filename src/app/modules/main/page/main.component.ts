import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '@app/authentication/auth.service';
import { AuthSession } from '@shared/models/AuthSession';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '@env';
import { StorageService } from '@app/services/storage.service';
import { MocksService } from '@app/http/mocks.service';

// import { Project } from '../../../../data/schema/project';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  // styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(public mocks: MocksService) { }

  request() {
    return new Promise<any>((resolve, reject) => {
      return this.mocks.calltounauthorized().subscribe(
        (response) => {
          console.log(response);
        }, (error) => {
          console.log("De Novo", error);
        });
    })
  }

  manyRequests() {
    this.request();
    this.request();
    this.request();
  }

  public ngOnInit() {
    console.log("Init...\n");

    this.manyRequests();
  }

}
