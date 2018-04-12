#!/bin/bash
set -e

git pull origin master
pm2 restart server