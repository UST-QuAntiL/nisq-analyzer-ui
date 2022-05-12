#!/bin/bash

# setup variables - uses environments/environments.ts.template file to copy correct ARG variables
envsubst <  src/environments/environment.ts.template > src/environments/environment.ts
ng serve --host 0.0.0.0 --disableHostCheck
