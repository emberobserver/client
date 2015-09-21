#!/bin/sh

ember build --environment production && scp -r dist/* eo@emberobserver.com:/srv/app/ember-observer/client/www/
