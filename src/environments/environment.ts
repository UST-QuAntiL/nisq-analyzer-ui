// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

/* eslint-disable */
export const environment = {
    production: window['env']['production'] || false,
    nisqAnalyzer: window['env']['nisqAnalyzer'] || true,
    NISQ_API_URL:
        window['env']['NISQ_ANALYZER_HOST_NAME'] &&
        window['env']['NISQ_ANALYZER_PORT']
            ? `http://${window['env']['NISQ_ANALYZER_HOST_NAME']}:${window['env']['NISQ_ANALYZER_PORT']}/nisq-analyzer`
            : 'http://localhost:5010/nisq-analyzer',
};
/* eslint-disable */

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
