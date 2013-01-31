#!/bin/bash
# Diego 20130131: bootstrap a TuiInnovation server from Debian

# create directories
mkdir -p /etc/tuiinnovation/
mkdir -p /var/tuiinnovation
mkdir -p /var/tuiinnovation/backup
mkdir -p /var/tuiinnovation/log
mkdir -p /var/tuiinnovation/log/deploy
mkdir -p /var/tuiinnovation/mongodb

# add 10gen key for MongoDB
apt-key adv --keyserver keyserver.ubuntu.com --recv -qq 7F0CEB10

# install required packages
apt-get update -qq

# The following package provides the command *mkfontdir*
# which is used in the setup.sh script
apt-get install -qq xfonts-utils

apt-get install -qq python-pip

# install Python extensions
pip install -q pymongo GitPython
