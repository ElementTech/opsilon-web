import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Filter } from '@lib/pipes/filter.pipe';
import {NgPipesModule} from 'ngx-pipes';
import {LogMessage, LogMonitorModule} from 'ngx-log-monitor';
import {NgxGraphModule} from '@swimlane/ngx-graph'
// ES6 Modules or TypeScript
import { ViewerPage } from '@lib/components/viewer/viewer.page';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { ThemeService } from '@lib/services';

@Component({
  standalone: true,
  selector: 'app-history',
  imports: [CommonModule,FormsModule,LogMonitorModule,NgPipesModule,NgxGraphModule,Filter,ViewerPage],
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.css'],
})

export class HistoryPage implements OnInit, OnDestroy, OnChanges {
  @Input() outputs = [];
  @Input() logStream$:Observable<any> | undefined;


  @Input() restoredLogs: LogMessage[] = [

  ];

  constructor(private _themeService: ThemeService,private ApiService: ApiService) {
  }
  currentTheme: any;
  private _destroy$ = new Subject();

  ngOnInit(){
    this._themeService.currentTheme$
    .pipe(takeUntil(this._destroy$))
    .subscribe((theme) => (this.currentTheme = (theme?.toString() == "system" ? "light" : theme?.toString())));

  }
  ngOnChanges(changes: SimpleChanges) {

    this.logStream$ = changes['logStream$'].currentValue
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

  }

  ngOnDestroy(): void {
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }
}

