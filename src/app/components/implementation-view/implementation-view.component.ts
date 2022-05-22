import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';
import { ImplementationService } from 'api-nisq/services/implementation.service';
import { UtilService } from '../util/util.service';

@Component({
  templateUrl: './implementation-view.component.html',
  styleUrls: ['./implementation-view.component.scss'],
})
export class ImplementationViewComponent implements OnInit {
  impl: ImplementationDto;
  implId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private implementationService: ImplementationService,
    private utilSerice: UtilService
  ) {}

  ngOnInit() {
    this.impl = this.utilSerice.getImplementationFromComponent();
  }
}
