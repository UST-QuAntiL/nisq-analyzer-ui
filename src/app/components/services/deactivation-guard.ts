import { Injectable } from '@angular/core';
import { CanDeactivate, Router } from '@angular/router';
import * as deepEqual from 'fast-deep-equal';
import { Subject } from 'rxjs';

import { UtilService } from '../util/util.service';
import { ImplementationSelectionCriteriaComponent } from '../implementation-selection-criteria/implementation-selection-criteria.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../generics/dialogs/confirm-dialog.component';

@Injectable()
export class ChangePageGuard
  implements CanDeactivate<ImplementationSelectionCriteriaComponent> {
  unsavedChanges = false;

  constructor(private _router: Router, private utilService: UtilService) {}

  canDeactivate(component: ImplementationSelectionCriteriaComponent) {
    const leavePage = new Subject<boolean>();
    if (!this.unsavedChanges) {
      const dialogData: ConfirmDialogData = {
        title: 'Confirm Page Change',
        message:
          'You have unsaved changes. Do you want to continue without saving?',
        yesButtonText: 'yes',
        noButtonText: 'no',
      };
      const dialogRef = this.utilService.createDialog(
        ConfirmDialogComponent,
        dialogData
      );
      dialogRef.afterClosed().subscribe((dialogResult) => {
        if (dialogResult) {
          leavePage.next(true);
        } else {
          leavePage.next(false);
        }
      });
      return leavePage.asObservable();
    }
    return true;
  }

  public objectsEqual<T>(source: T, target: T): boolean {
    this.unsavedChanges = deepEqual(source, target);
    return this.unsavedChanges;
  }
}
