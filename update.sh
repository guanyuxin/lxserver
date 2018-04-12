#!/bin/bash
set -e

git add .
git commit -a -m 'u'
git push o master
curl "http://guanyuxin.com:3000/updateAndRestartServer"