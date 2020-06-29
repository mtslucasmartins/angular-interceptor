import { NgModule } from '@angular/core';

import { MainComponent } from './page/main.component';
import { MainRoutingModule } from './main.routing';

// import { SharedModule } from '@shared/shared.module';

// import { UserDetailsComponent } from './page/user-details/user-details.component';

@NgModule({
  declarations: [
    MainComponent,
  ],
  imports: [
    // SharedModule,
    MainRoutingModule
  ],
  exports: [],
  providers: [],
  entryComponents: []
})
export class MainModule { }
