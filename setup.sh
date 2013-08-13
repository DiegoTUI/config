#!/bin/bash
# Diego 20130131: setup TuiInnovation server and/or update config

current=$( pwd )

# link cron jobs -- without periods in the name
ln -fs "$current/cron/backup.sh" /etc/cron.daily/backup
ln -fs "$current/cron/update-tickets.sh" /etc/cron.daily/update-tickets

# Set up nginx
ln -fs "$current/nginx/nginx-tuiinnovation" /etc/nginx/sites-available/tuiinnovation
ln -fs /etc/nginx/sites-available/tuiinnovation /etc/nginx/sites-enabled/tuiinnovation
rm -f /etc/nginx/sites-enabled/default
service nginx reload

# stop services
stop mashoop

cp -f $current/upstart/mashoop.conf /etc/init/

# start services again
start mashoop

