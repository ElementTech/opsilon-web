import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {NgPipesModule} from 'ngx-pipes';
import { ApiService } from 'src/app/services/api.service';import {DataTablesModule,DataTableDirective} from 'angular-datatables'
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2'

export class RepoLocation {

  constructor(
    public Type: string,
    public Path: string,
    public Subfolder?: string,
    public Branch?: string
  ) {  }

}
export class Repository {

  constructor(
    public Name: string,
    public Location: RepoLocation,
    public Description?: string,
  ) {  }

}
@Component({
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule,DataTablesModule],
  templateUrl: './repositories.page.html',
  styleUrls: ['./repositories.page.css'],
})

export class RepositoriesPage {


  constructor(private ApiService: ApiService){}
  repos: any[] = [];
  displayTable = false;

  dtOptions: any = {};

  loadTable() {
    this.dtOptions = this.ApiService.get("repo/list")
      .toPromise()
      .then(data=>this.repos = (data as any));
  }
  ngOnInit(): void {

     this.loadTable()
  }

  model = new Repository("example",new RepoLocation("git","https://github.com/jatalocks/opsilon.git","examples/workflows/examples","main"),"");

  submitted = false;

  onSubmit() { this.submitted = true; }
  public deleteRepo(name:string) {
    this.ApiService.deleteText("repo/delete",name).subscribe(()=>{
      Swal.fire({
        title: 'Repository Deleted',
        timer: 1000,
        icon: 'success',
        showConfirmButton: false,
        position: 'top-end',
      });
      this.loadTable()
    }, err=>{
      Swal.fire({
        title: 'Error',
        text: err,
        icon: 'error',
        confirmButtonText: 'Confirm',
        timer: 5000,
      })
    })
  }
  public newRepo() {
    this.ApiService.post("repo/add",this.model).subscribe(()=>{
      Swal.fire({
        title: 'Repository Added',
        timer: 1000,
        icon: 'success',
        showConfirmButton: false,
        position: 'top-end',
      });
      this.model = new Repository('',new RepoLocation("","","",""),'');

      this.loadTable()
    }, err=>{
      Swal.fire({
        title: 'Error',
        text: err.error,
        icon: 'error',
        confirmButtonText: 'Confirm',
        timer: 5000,
      })
    })
  }

}


