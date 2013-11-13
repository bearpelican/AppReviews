AppReviews
==========

App review scraper

#Setup (if you haven't already):
1. Install Node- http://nodejs.org/download/
2. brew install mongodb
3. Install git
4. Install jruby- rvm install jruby-1.7.6
5. Install supermarket- gem install supermarket
 - You will need to provide your Google market credentials in ~/.supermarket.yml:
  * login: foo@gmail.com
  * password: secret
6. git clone git@github.com:bearpelican/AppReviews.git
7. sudo easy_install pip
8. sudo pip install elementtree

#Running

1. Run mongodb (mongod)
2. cd PATH/AppReviews
3. node app.js

#In browser

1. Navigate to localhost:3000
2. Add application you want to track- 
  * ** iOS Apps- topappcharts.com has the apple id in the url (9 digits)
  * ** Android Apps- play.google.com also has id in url (com.XXX.XXX)

#Run scripts

1. To run iOS
  * rvm use jruby
  * ruby PATH/AppReviews/scripts/AndroidReviews/uploader.sh
2. To run Android
  * python PATH/AppReviews/scripts/AndroidReviews/uploader.sh

#Or... in crontab...
  * 5,35 * * * * ~/AppReviews/scripts/AndroidReviews/uploader.sh
  * 10,40 * * * * /usr/bin/python27 ~/AppReviews/scripts/iOSReviews/AppStoreReviews.py

#Troubleshooting
1. If you are running this on a mac, and get
 - No `java' exists at /usr/lib/jvm/java-6-sun/bin/java, please double-check JAVA_HOME
 - run this command- export JAVA_HOME=`/usr/libexec/java_home -v 1.6`
 - or put it in your .bash_profile to do this by default
2. 
