#!/bin/bash
# Diego 20130131: setup TuiInnovation server and/or update config

current=$( pwd )

# link cron jobs -- without periods in the name
ln -fs "$current/backup/backup.sh" /etc/cron.daily/backup

# Set up nginx
ln -fs "$current/nginx/nginx-tuiinnovation" /etc/nginx/sites-available/tuiinnovation
ln -fs /etc/nginx/sites-available/tuiinnovation /etc/nginx/sites-enabled/tuiinnovation
service nginx reload

# stop services
stop mashoop

cp -f $current/upstart/mashoop.conf /etc/init/

# start services again
start mashoop

