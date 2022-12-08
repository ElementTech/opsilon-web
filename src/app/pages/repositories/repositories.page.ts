import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {NgPipesModule} from 'ngx-pipes';
import { ApiService } from 'src/app/services/api.service';import {DataTablesModule,DataTableDirective} from 'angular-datatables'
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule,DataTablesModule],
  templateUrl: './repositories.page.html',
  styleUrls: ['./repositories.page.css'],
})

export class RepositoriesPage {


  constructor(private ApiService: ApiService){}
  repos: any[] = [];
  displayTable = false;

  dtOptions: any = {};


  ngOnInit(): void {

      this.dtOptions = this.ApiService.get("repo/list")
      .toPromise()
      .then(data=>this.repos = (data as any));
  }

}


