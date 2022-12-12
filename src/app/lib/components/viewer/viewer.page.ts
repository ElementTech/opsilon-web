import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { Filter } from '@lib/pipes/filter.pipe';
import {NgPipesModule} from 'ngx-pipes';
import {LogMonitorModule} from 'ngx-log-monitor';
import { ThemeService } from '@lib/services';
import * as yaml from 'yaml'
import {
  NuMonacoEditorComponent,
  NuMonacoEditorDiffComponent,
} from '@ng-util/monaco-editor';

@Component({
  standalone: true,
  selector: 'app-viewer',
  imports: [CommonModule,FormsModule,LogMonitorModule,NuMonacoEditorComponent, NuMonacoEditorDiffComponent, NgPipesModule,Filter],
  templateUrl: './viewer.page.html',
  styleUrls: ['./viewer.page.css'],
})

export class ViewerPage implements OnInit {
  public yaml = yaml;
  @Input() repo = '';
  @Input() workflow = '';
  themes = ['vs', 'vs-dark', 'hc-black'];
  options = { theme: 'vs' };
  disabled = true;
  // repo!: string | null;
  // workflow!: string | null;
  workflows!: Observable<any> | null;
  constructor(private _themeService: ThemeService,private ApiService: ApiService,private _activatedRoute: ActivatedRoute) {
    // this.repo = this._activatedRoute.snapshot.paramMap.get('repo');
    // this.workflow = this._activatedRoute.snapshot.paramMap.get('workflow');
  }
  private _destroy$ = new Subject();
  ngOnInit(){
    this._themeService.currentTheme$
      .pipe(takeUntil(this._destroy$))
      .subscribe((theme) => (
        this.options = { theme: (theme?.toString() == 'light'||theme?.toString()=='system' ? 'vs' : 'vs-dark') }
    ));
    this.workflows = this.ApiService.get("list")
  }

  ngOnDestroy(): void {
    this._destroy$.complete();
    this._destroy$.unsubscribe();
  }

}

