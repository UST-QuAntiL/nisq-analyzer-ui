import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private planqkPlatformLoginService: PlanqkPlatformLoginService,
    private utilService: UtilService,
    public plugin: QhanaPluginService
  ) {}

  ngOnInit(): void {
    if (this.plugin.isPlugin) {
      this.plugin.initializePlugin();
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
