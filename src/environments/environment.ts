// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  firebase: {
    projectId: 'quizploeg-spacemuffins',
    appId: '1:111999521124:web:8a25822dc7155d97186a71',
    storageBucket: 'quizploeg-spacemuffins.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyAjX0XjjACyFWQyMwBqdQDFcX9r4xvZvxk',
    authDomain: 'quizploeg-spacemuffins.firebaseapp.com',
    messagingSenderId: '111999521124',
    measurementId: 'G-FVWH9B022C',
  },
  production: false,
  postcodeAPI: 'https://opzoeken-postcode.be/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
