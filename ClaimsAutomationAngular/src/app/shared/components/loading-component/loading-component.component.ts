import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../loading-service.service';

@Component({
  selector: 'app-loading-component',
  templateUrl: './loading-component.component.html',
  styleUrls: ['./loading-component.component.css'],
})
export class LoadingComponentComponent implements OnInit {
  loading$ = this.loadingService.loading$;
  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {}
}
