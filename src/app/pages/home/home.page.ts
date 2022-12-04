import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import {DataTablesModule,DataTableDirective} from 'angular-datatables'

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule,DataTablesModule],
  providers: [DataTableDirective],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.css'],
})
export class HomePage implements OnInit {

  constructor(private ApiService: ApiService){}
  workflows: any[] = [];
  displayTable = false;

  dtOptions: any = {};


  ngOnInit(): void {

      this.dtOptions = this.ApiService.get("list")
      .toPromise()
      .then(data=>this.workflows = (data as any));
  }


}
