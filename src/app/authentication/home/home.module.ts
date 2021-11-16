import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { HomeFooterComponent } from 'src/app/components/home-footer/home-footer.component';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedDirectivesModule
  ],
  declarations: [HomePage, HomeFooterComponent]
})
export class HomePageModule { }
