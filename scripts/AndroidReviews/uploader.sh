#!/bin/bash

source /etc/profile.d/rvm.sh
rvm use jruby
cd ~/jenkins/cronjobs/AndroidStoreReviews #so bundler knows where gemfile is
ruby ~/jenkins/cronjobs/AndroidStoreReviews/astrid_google_reviews.rb
