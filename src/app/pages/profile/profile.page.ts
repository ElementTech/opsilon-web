import { CommonModule, KeyValue } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { buffer, bufferCount, catchError, concatAll, concatMap, delay, finalize, forkJoin, from, last, map, mergeAll, Observable, of, partition, pluck, scan, startWith, Subject, take, takeUntil, tap, timer, toArray } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Filter } from '@lib/pipes/filter.pipe';
import {NgPipesModule} from 'ngx-pipes';
import {LogMonitorModule} from 'ngx-log-monitor';
import {LogMessage} from 'ngx-log-monitor';
import { ThemeService } from '@lib/services';
import { AppTheme } from '@lib/services/theme';
import {NgxGraphModule} from '@swimlane/ngx-graph'
import { webSocket } from "rxjs/webSocket";
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'
@Component({
  standalone: true,
  imports: [CommonModule,FormsModule,LogMonitorModule,NgPipesModule,NgxGraphModule,Filter],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.css'],
})

export class ProfilePage implements OnInit {
  restoredLogs: LogMessage[] = [

  ];
  status = ""
  outputs = [];
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
  history: any[]= [];
  constructor(private _themeService: ThemeService,private ApiService: ApiService,private _activatedRoute: ActivatedRoute) {
    this.repo = this._activatedRoute.snapshot.paramMap.get('repo');
    this.workflow = this._activatedRoute.snapshot.paramMap.get('workflow');
  }
  runid = "";
  currentTheme: any;
  // runningHistory: any[]= [];
  private _destroy$ = new Subject();

  node1 = {id: 'Node 1', width: 100, height: 50};
  node2 = {id: 'Node 2', width: 100, height: 50};
  edge1 = {src: this.node1, dest: this.node2, points: []};
  myGraphData = {
    nodes: [this.node1, this.node2],
    edges: [this.edge1],
  };
  tempLogs: LogMessage[] = [

  ];
  processWSLog(msg:any){
  //   {
  //     "_id": {
  //         "_data": "8263935890000000012B022C0100296E5A1004F2A13BC345B6407CB9C9120326974ED946645F6964006463935890C41AD6B85B7E301B0004"
  //     },
  //     "clusterTime": {
  //         "T": 1670600848,
  //         "I": 1
  //     },
  //     "documentKey": {
  //         "_id": "63935890c41ad6b85b7e301b"
  //     },
  //     "fullDocument": {
  //         "_id": "63935890c41ad6b85b7e301b",
  //         "createddate": "2022-12-09T17:47:28.276+02:00",
  //         "log": "[write a file:writefile] Evaluating If Statement: $arg3 != \"\", with the following variables: [{filename testValue} {onlyhere something} {arg1 f} {arg2 defaultvalue} {arg3 fsad}]",
  //         "runid": "c8baf114-77d8-11ed-bd30-acde48001122",
  //         "stage": "writefile",
  //         "updateddate": "2022-12-09T17:47:30.276+02:00",
  //         "workflow": "4371302350013818559"
  //     },
  //     "ns": {
  //         "coll": "logs",
  //         "db": "opsilon"
  //     },
  //     "operationType": "insert",
  //     "wallTime": "2022-12-09T17:47:28.299+02:00"
  // }
    const exists = this.history.filter(item=>((item.Workflow==msg.fullDocument.workflow)&&(item.RunID==msg.fullDocument.runid)))
    if (exists.length == 0) {
        this.history.push({
          "SkippedStages": 0,
          "FailedStages": 0,
          "SuccessfulStages": 0,
          "Workflow": msg.fullDocument.workflow,
          "RunID": msg.fullDocument.runid,
          "Logs": [
              msg.fullDocument.log
          ],
          "Outputs": [],
          "Result": "unknown",
          "RunTime": 0,
          "StartTime": msg.fullDocument.createddate,
          "EndTime": msg.fullDocument.updateddate
      })
      if (msg.fullDocument.stage!="system" && (this.runid == msg.fullDocument.runid)){
        this.tempLogs.push({message: msg.fullDocument.log})
      }
    } else {
      this.history = this.history.map(item=>{
        if ((item.Workflow==msg.fullDocument.workflow)&&(item.RunID==msg.fullDocument.runid)){
          item.Logs.push(msg.fullDocument.log)
          if (msg.fullDocument.stage=="system"){
            item.RunTime=msg.fullDocument.log
          } else if (this.runid == item.RunID) {
            this.tempLogs.push({message: msg.fullDocument.log})
          }
          item.Result="unknown"
        }
        return item
      })
      if (msg.fullDocument.stage=="system"&&msg.fullDocument.log=="done"){
        this.updateHistory()
        this.logStream$=undefined
      }
    }

  }
  showOutputs(outputs=[]){
    const html = '<table class="table" style="width:100%"><thead><th>Name</th><th>Value</th></thead><tbody>' +
      outputs.map(item=>'<tr><td>'+item["Name"]+'</td><td>'+item["Value"]+'</td></tr>')
    '</tbody></table>'
    Swal.fire({
      // title: '<strong>HTML <u>example</u></strong>',
      // icon: 'info',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      html:html,
      // showCloseButton: true,
      // showCancelButton: true,
      // focusConfirm: false,
      // confirmButtonText:
      //   '<i class="fa fa-thumbs-up"></i> Great!',
      // confirmButtonAriaLabel: 'Thumbs up, great!',
      // cancelButtonText:
      //   '<i class="fa fa-thumbs-down"></i>',
      // cancelButtonAriaLabel: 'Thumbs down'
    })
  }
  ngOnInit(){
    const subject = webSocket('ws://' + window.location.host + '/ws');

    subject.subscribe(
       msg => this.processWSLog(msg), // Called whenever there is a message from the server.
       err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
       () => console.log('complete') // Called when connection is closed (for whatever reason).
     );


    this._themeService.currentTheme$
      .pipe(takeUntil(this._destroy$))
      .subscribe((theme) => (this.currentTheme = (theme?.toString() == "system" ? "light" : theme?.toString())));

    this.workflows = this.ApiService.get("list")
    this.updateHistory()
  }

  predicate = (value: any, index: number, array: any[]): boolean => {
    return (value.skipped === true) || (value.result === true);
  };
  // Order by ascending property value
  valueAscOrder = (a: any, b: any): number => {
    return b.value[0].createddate.localeCompare(a.value[0].createddate);
  }
  updateHistory(){
    this.ApiService.getWorkflowHistory(this.workflow,this.repo).subscribe(data=>{
      this.history=data;
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
  restoreLogs(logs: string[],result: any,runid: string){
    if (result != "unknown") {
      this.restoredLogs = logs.map((item: string)=>{
        return {message: item}
      })
    } else {
      this.restoredLogs = [];
      this.logStream$= timer(0, 100).pipe(
        map(i => this.tempLogs[i])
      );
      this.runid = runid
    }
  }
  public deleteRun(name:string) {
    Swal.fire({
      title: 'Do you want to delete this run?',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Confirm',
      denyButtonText: `Cancel`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.ApiService.deleteText("run/delete",name).subscribe((data)=>{
          Swal.fire({
            title: 'Run Deleted',
            timer: 1000,
            text: data,
            icon: 'success',
            showConfirmButton: false,
            position: 'top-end',
          });

          this.updateHistory()
        }, err=>{
          Swal.fire({
            title: 'Error',
            text: err,
            icon: 'error',
            confirmButtonText: 'Confirm',
            timer: 5000,
          })
        })
      } else if (result.isDenied) {
        // Swal.fire('Changes are not saved', '', 'info')
      }
    })

  }
  play() {
    const inputs = Array.prototype.slice.call(document.querySelectorAll('input[name=input]'))
    const inputMap :any = {};
    inputs.forEach(item=>{
      inputMap[item.id] = item.value
    })
    this.workflows?.subscribe(items=>{
      const chosen = items.filter((item: { ID: string | null; Repo: string | null; Input: string | any[]; })=>(item.ID===this.workflow)&&(item.Repo===this.repo)&&(inputs.length==(item.Input != null ? item.Input.length : 0)))
      if (chosen.length != 0){
        // this.status=""
        Swal.fire({
          title: 'Workflow Started',
          timer: 1000,
          icon: 'success',
          showConfirmButton: false,
          position: 'top-end',
        });
        this.logStream$ = this.ApiService.runWorkflow({
          Args: inputMap,
          Repo: this.repo,
          Workflow: this.workflow
        }).pipe(
            concatAll(),
            delay(1000),
            map((i:any)=> {
            {return {message: i.Logs[0], type:this.getType(i.Result,i.Skipped)}}
          }),finalize(()=>{this.status="";this.updateHistory()})
        );


      } else {
        setTimeout(function(){
          Swal.fire({
            title: 'Error',
            text: 'Input Invalid',
            icon: 'error',
            confirmButtonText: 'Confirm',
            timer: 1500,
          })
       }, 2000);//wait 2 seconds
      }
    })
  }

}


