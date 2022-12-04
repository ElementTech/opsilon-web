import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {NgPipesModule} from 'ngx-pipes';
import {LogMonitorModule} from 'ngx-log-monitor';
@Component({
  standalone: true,
  imports: [CommonModule,FormsModule,LogMonitorModule,NgPipesModule],
  templateUrl: './repositories.page.html',
  styleUrls: ['./repositories.page.css'],
})

export class RepositoriesPage {

}


