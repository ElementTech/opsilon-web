import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { buffer, bufferCount, catchError, concatAll, concatMap, delay, forkJoin, from, last, map, mergeAll, Observable, of, partition, pluck, scan, Subject, take, takeUntil, tap, timer, toArray } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Filter } from '@lib/pipes/filter.pipe';
import {NgPipesModule,GroupByPipe} from 'ngx-pipes';
import {LogMonitorModule} from 'ngx-log-monitor';
import {LogMessage} from 'ngx-log-monitor';
import { ThemeService } from '@lib/services';
import { AppTheme } from '@lib/services/theme';
@Component({
  standalone: true,
  imports: [CommonModule,FormsModule,LogMonitorModule,NgPipesModule,Filter],
  providers:[GroupByPipe],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css'],
})

export class ProfilePage implements OnInit {
  restoredLogs: LogMessage[] = [
    {message: 'A simple restored log message'},
    {message: 'A success restored message', type: 'SUCCESS'},
    {message: 'A warning restored message', type: 'WARN'},
    {message: 'An error restored message', type: 'ERR'},
    {message: 'An info restored message', type: 'INFO'},
  ];

  logs: LogMessage[] = [
    {message: 'A simple log message'},
    {message: 'A success message', type: 'SUCCESS'},
    {message: 'A warning message', type: 'WARN'},
    {message: 'An error message', type: 'ERR'},
    {message: 'An info message', type: 'INFO'},
  ];
  logStream$:Observable<any> | undefined;
  // logStream$= timer(0, 1000).pipe(
  //   take(this.logs.length),
  //   map(i => this.logs[i])
  // );
  wLog$!: Observable<any>;
  args: Map<string, string> = new Map();
  repo!: string | null;
  workflow!: string | null;
  workflows!: Observable<any> | null;
  id: string | undefined;
  history: Observable<any> | undefined;
  constructor(private _themeService: ThemeService,private ApiService: ApiService,private _activatedRoute: ActivatedRoute) {
    this.repo = this._activatedRoute.snapshot.paramMap.get('repo');
    this.workflow = this._activatedRoute.snapshot.paramMap.get('workflow');
  }
  currentTheme: any;
  private _destroy$ = new Subject();

  ngOnInit(){
    this._themeService.currentTheme$
      .pipe(takeUntil(this._destroy$))
      .subscribe((theme) => (this.currentTheme = (theme?.toString() == "system" ? "light" : theme?.toString())));

    this.workflows = this.ApiService.get("list")
    this.updateHistory()
  }

  updateHistory(){
    this.ApiService.getWorkflowID(this.workflow,this.repo).subscribe(id=>{
      this.history = this.ApiService.getWorkflowHistory(id)
      this.ApiService.getWorkflowHistory(id).subscribe(data=>console.log(data))
    })
  }

  ngOnDestroy(): void {
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }
  getType(result:boolean,skipped:boolean){
    switch (skipped) {
      case true:
        return 'INFO'
      case false:
        if (result) {
          return
        } else {
          return 'ERR'
        }
      default:
        return
    }
  }
  play() {
    const inputs = Array.prototype.slice.call(document.querySelectorAll('input[name=input]'))
    const inputMap :any = {};
    inputs.forEach(item=>{
      inputMap[item.id] = item.value
    })
    this.workflows?.subscribe(items=>{
      const chosen = items.filter((item: { ID: string | null; Repo: string | null; Input: string | any[]; })=>(item.ID===this.workflow)&&(item.Repo===this.repo)&&(inputs.length==item.Input.length))
      if (chosen.length != 0){


        this.logStream$ = this.ApiService.runWorkflow({
          Args: inputMap,
          Repo: this.repo,
          Workflow: this.workflow
        }).pipe(
            concatAll(),
            delay(1000),
            map((i:any)=> {
            return {message: i.Logs[0], type:this.getType(i.Result,i.Skipped)}
          })
        );


      } else {
        setTimeout(function(){
          alert("Input Invalid");
       }, 2000);//wait 2 seconds
      }
    })
  }
}


