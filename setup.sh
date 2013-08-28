#!/bin/bash
# Diego 20130131: setup TuiInnovation server and/or update config

current=$( pwd )

# install crontab for user ubuntu
crontab -u ubuntu -r
crontab -u ubuntu "$current/cron/crontab-update-tickets"

# Set up nginx
ln -fs "$current/nginx/nginx-tuiinnovation" /etc/nginx/sites-available/tuiinnovation
ln -fs /etc/nginx/sites-available/tuiinnovation /etc/nginx/sites-enabled/tuiinnovation
rm -f /etc/nginx/sites-enabled/default
service nginx reload

# stop services
stop mashoop
stop deploy

cp -f $current/upstart/mashoop.conf /etc/init/
cp -f $current/upstart/deploy.conf /etc/init/

# start services again
start mashoop
start deploy

