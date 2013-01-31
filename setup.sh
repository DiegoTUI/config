#!/bin/bash
# Diego 20130131: setup TuiInnovation server and/or update config

# refresh repo
git pull -q

current=$( pwd )

mkfontdir /var/lib/defoma/x-ttcidfont-conf.d/dirs/TrueType

# Add non debian repos to apt sources
ln -fs "$current/mongodb/sources.mongodb.list" /etc/apt/sources.list.d/

# Update
apt-get update -qq
# Install mongodb, phantomjs and haveged
apt-get install -qqy mongodb-10gen phantomjs haveged

# install missing Debian packages
packages_debian=$(cat "package/debian-packages.txt")
apt-get install -y --force-yes nginx  # Only force the nginx one.
apt-get install -qqy $packages_debian

# give permisisons and create Debian defaults for MongoDB
chown -R mongodb:mongodb /var/tuiinnovation/mongodb
chown root.mongodb /var/tuiinnovation/log
chmod g+w /var/tuiinnovation/log

# restart mongodb, give it time to start up
rm /etc/init.d/mongodb
ln -fs "$current/mongodb/mongodb" /etc/init.d/mongodb
/etc/init.d/mongodb restart

# update PHP modules
pecl_packages=$(cat "package/pecl-packages.txt")
pecl -q install $pecl_packages
# pecl -q upgrade

# link configuration files around
rm /etc/apache2/ports.conf
ln -fs "$current/apache/ports-tuiinnovation.conf" /etc/apache2/ports.conf
ln -fs "$current/apache/apache-tuiinnovation" /etc/apache2/sites-enabled/
ln -fs "$current/apache/php-tuiinnovation.ini" /etc/php5/conf.d/
ln -fs "$current/apache/logrotate-apache-tuiinnovation" /etc/logrotate.d/
ln -fs "$current/nginx/nginx-tuiinnovation" /etc/nginx/sites-enabled/
ln -fs "$current/nginx/logrotate-nginx-tuiinnovation" /etc/logrotate.d/
ln -fs "$current/package/apt-tuiinnovation.conf" /etc/apt/apt.conf.d/50tuiinnovation
ln -fs "$current/util/vimrc" /root/.vimrc
ln -fs "$current/log/rsyslog-tuiinnovation.conf" /etc/rsyslog.d/
ln -fs ../mods-available/headers.load /etc/apache2/mods-enabled/

# link cron jobs -- without periods in the name
ln -fs "$current/backup/backup.sh" /etc/cron.daily/backup

# set up web repos
mkdir -p /var/tuiinnovation/deploy

# restart remaining services
/etc/init.d/apache2 restart
/etc/init.d/nginx restart

# go to update
./update.sh
