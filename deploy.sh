#!/bin/sh

ember build --environment production
scp -r dist/* ember-site@emberobserver.com:/srv/app/ember-site/client/www/
