#!/bin/bash
# Diego 20130131: main script for backup

timestamp=$(date +%Y-%m-%d_%H-%M%z)
echo $timestamp
directory="dump-$timestamp"
compressed="backup-mongodb_{$timestamp}_$(hostname).tar.gz"
task="MongoDB backup"

cd /var/tuiinnovation/backup
rm -Rf dump*

# blacklisting: go over the collections and backup all off them.
#       We have to do it because the blacklisting feature is not yet
#       merged in MongoDB. See https://jira.mongodb.org/browse/SERVER-2459
collections=`echo "show collections" | mongo tuiinnovation | grep -v 'bye' | grep -v 'MongoDB shell version:' | grep -v 'connecting to:'`
for collection in $collections
do
#	if [ "$collection" != "monitoring" ] && [ "$collection" != "deltas" ]; then
	mongodump --db tuiinnovation -c $collection --out $directory
#	fi
done
tar -czf $compressed $directory

s3cmd put $compressed s3://mibbackup -m application/x-gtar

# delete files from ten days ago
tendaysago='backup-mongodb_{$(date --date="10 days ago" +%Y-%m-%d)_*'
echo "Removing files from two days ago: $tendaysago"
rm -f $tendaysago

