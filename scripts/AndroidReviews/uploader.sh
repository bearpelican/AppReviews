#!/bin/bash

source /etc/profile.d/rvm.sh
rvm use jruby
cd ~/AppReviews/scripts/AndroidReviews #so bundler knows where gemfile is
ruby ~/AppReviews/scripts/AndroidReviews/astrid_market_uploader.rb
