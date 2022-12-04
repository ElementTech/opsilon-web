import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoComponent implements OnInit {
  constructor(private ApiService: ApiService){}
  version!: Observable<Text>;
  ngOnInit() {
    this.version = this.ApiService.getVersion()
  }
}
