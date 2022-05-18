import { Component, OnInit } from '@angular/core';
import { ImplementationService } from 'api-nisq/services/implementation.service';
import { ImplementationDto } from 'api-nisq/models/implementation-dto';
import { Router } from '@angular/router';
import { UtilService } from '../util/util.service';
import { AddImplementationDialogComponent } from './dialogs/add-implementation-dialog/add-implementation-dialog.component';

@Component({
  selector: 'app-algorithms-implementations-list',
  templateUrl: './algorithms-implementations-list.component.html',
  styleUrls: ['./algorithms-implementations-list.component.scss'],
})
export class AlgorithmsImplementationsListComponent implements OnInit {
  allImpls: ImplementationDto[] = [];
  allAlgorithms = new Set<string>();

  constructor(
    private nisqImplementationService: ImplementationService,
    private router: Router,
    private utilService: UtilService
  ) {}

  ngOnInit(): void {
    this.nisqImplementationService.getImplementations().subscribe((impls) => {
      this.allImpls = impls.implementationDtos;
      this.allImpls.forEach((impl) => {
        if (impl.algorithmName !== null) {
          this.allAlgorithms.add(impl.algorithmName);
        }
      });
    });
  }

  onCreateImplementation(): void {
    this.utilService
      .createDialog(AddImplementationDialogComponent, {
        title: 'Add new implementation',
      })
      .afterClosed()
      .subscribe((dialogResult) => {
        if (dialogResult) {
        }
      });
  }

  navigateToImplementation(impl: ImplementationDto): void {
    void this.router.navigate([
      'algorithms',
      impl.implementedAlgorithm,
      'implementations',
      impl.id,
      'selection-criteria',
    ]);
  }
}
