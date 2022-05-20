import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';
import { ImplementationService } from 'api-nisq/services/implementation.service';

@Component({
  templateUrl: './implementation-view.component.html',
  styleUrls: ['./implementation-view.component.scss'],
})
export class ImplementationViewComponent implements OnInit {
  impl: ImplementationDto;
  implId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private implementationService: ImplementationService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(({ algoId, implId }) => {
      this.implementationService
        .getImplementation({ implId })
        .subscribe((impl) => {
          this.impl = impl;
        });
    });
  }
}
