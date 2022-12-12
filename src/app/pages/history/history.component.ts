import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {HistoryPage} from '@lib/components/history/history.page'
import { LogMessage } from 'ngx-log-monitor';
import { map, Observable, timer } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [HistoryPage],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  repo: string | null | undefined;
  workflow: string | null | undefined;
  runid: string | null | undefined;
  logStream$:Observable<any> | undefined;
  restoredLogs: LogMessage[] = [
  ];

  constructor(private _activatedRoute: ActivatedRoute,private ApiService: ApiService) { }
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
      if (msg.fullDocument.stage!="system" && (this.runid == msg.fullDocument.runid)){
        this.restoredLogs.push({message: msg.fullDocument.log})
      }
       else {
        if (msg.fullDocument.stage=="system"&&msg.fullDocument.log=="done"){
          this.logStream$=undefined
        }
      }

    }
  ngOnInit(): void {
    this.repo = this._activatedRoute.snapshot.paramMap.get('repo');
    this.workflow = this._activatedRoute.snapshot.paramMap.get('workflow');
    this.runid = this._activatedRoute.snapshot.paramMap.get('runid');
    const subject = webSocket((window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.host + '/api/v1/ws');

    subject.subscribe(
       msg => this.processWSLog(msg), // Called whenever there is a message from the server.
       err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
       () => console.log('complete') // Called when connection is closed (for whatever reason).
     );

     this.ApiService.getWorkflowHistory(this.workflow,this.repo).subscribe(data=>{
        data.forEach((w: { RunID: string | null | undefined; Logs: string[]; Result: any; }) => {
          if (w.RunID == this.runid){
            this.restoreLogs(w.Logs,w.Result)
          }
        });
      })
  }
  restoreLogs(logs: string[],result: any){
    if (result != "unknown") {
      this.restoredLogs = logs.map((item: string)=>{
        return {message: item}
      })
    } else {
      this.restoredLogs = [];
      this.logStream$= timer(0, 100).pipe(
        map(i => this.restoredLogs[i])
      );
    }
  }
}
