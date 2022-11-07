import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { PlanqkPlatformLoginService } from '../services/planqk-platform-login.service';
import { QhanaPluginService } from '../services/qhana-plugin.service';
import { UtilService } from '../util/util.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent implements OnInit {
  bearerTokenSet = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private planqkPlatformLoginService: PlanqkPlatformLoginService,
    private utilService: UtilService,
    public qhanaService: QhanaPluginService
  ) {}

  ngOnInit(): void {
    if (this.qhanaService.isPlugin) {
      this.qhanaService.initializePlugin(this.route);
    } else {
      this.planqkPlatformLoginService
        .isLoggedIn()
        .subscribe((loggedIn: boolean) => {
          if (loggedIn) {
            this.bearerTokenSet = true;
            this.reloadStartPage();
            this.utilService.callSnackBar(
              'Successfully logged into the PlanQK platform.'
            );
          } else {
            this.utilService.callSnackBar(
              'Not logged into the PlanQK platform.'
            );
          }
        });
    }
  }

  ngAfterViewChecked(): void {
    this.qhanaService.notifyParentWindowOnHeightChange();
  }

  goToHome(): void {
    void this.router.navigate(['/']);
  }

  login(): void {
    if (!this.bearerTokenSet) {
      // login
      this.planqkPlatformLoginService.loginToPlanqkPlatform();
    } else {
      // logout
      this.bearerTokenSet = false;
      this.reloadStartPage().subscribe(() => {
        this.planqkPlatformLoginService.logoutFromPlanqkPlatform();
        this.utilService.callSnackBar(
          'Successfully logged out of the PlanQK platform.'
        );
      });
    }
  }

  reloadStartPage(): Observable<boolean> {
    return from(
      this.router
        .navigateByUrl(location.origin, { skipLocationChange: true })
        .then(() => this.router.navigate(['/algorithms']))
    );
  }
}
