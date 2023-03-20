import { KeycloakService } from 'keycloak-angular';

export const initializeKeycloak =
  (keycloak: KeycloakService) => (): Promise<boolean> =>
    keycloak
      .init({
        config: {
          url: 'https://login.planqk.de/',
          realm: 'planqk',
          clientId: 'planqk-login',
        },
        initOptions: {
          checkLoginIframe: false,
        },
        enableBearerInterceptor: false,
      })
      .then((retValue) => retValue);
