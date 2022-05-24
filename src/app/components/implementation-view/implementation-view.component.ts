import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';
import { mergeMap, Observable } from 'rxjs';
import { AlgorithmsService } from '../util/algorithms.service';

@Component({
  templateUrl: './implementation-view.component.html',
  styleUrls: ['./implementation-view.component.scss'],
})
export class ImplementationViewComponent implements OnInit {
  impl: Observable<ImplementationDto>;
  implId: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private algorithms: AlgorithmsService
  ) {}

  ngOnInit() {
    this.algorithms.updateAlgorithms(); // TODO optimize this better
    this.impl = this.activatedRoute.params.pipe(
      mergeMap(params => {
        return this.algorithms.getImplementation(params.implId);
      })
    );
  }
}
