#!/usr/bin/env python
# coding: utf-8
''' Apple AppStore reviews scrapper
    version 2011-04-12
    Tomek "Grych" Gryszkiewicz, grych@tg.pl
    http://www.tg.pl

    based on "Scraping AppStore Reviews" blog by Erica Sadun
     - http://blogs.oreilly.com/iphone/2008/08/scraping-appstore-reviews.html
    AppStore codes are based on "appstore_reviews" by Jeremy Wohl
     - https://github.com/jeremywohl/iphone-scripts/blob/master/appstore_reviews
'''
import urllib2
from elementtree import ElementTree
import sys
import string
import argparse
import re
from datetime import datetime, date, time
import urllib2
import urllib
import json
import os
import hashlib

debug = False
if debug:
    server_url = 'http://localhost:3000/api/'
else:
    server_url = 'http://localhost:3000/api/'


platform = "iOS"

appStores = {
'Argentina':          143505,
'Australia':          143460,
'Belgium':            143446,
'Brazil':             143503,
'Canada':             143455,
'Chile':              143483,
'China':              143465,
'Colombia':           143501,
'Costa Rica':         143495,
'Croatia':            143494,
'Czech Republic':     143489,
'Denmark':            143458,
'Deutschland':        143443,
'El Salvador':        143506,
'Espana':             143454,
'Finland':            143447,
'France':             143442,
'Greece':             143448,
'Guatemala':          143504,
'Hong Kong':          143463,
'Hungary':            143482,
'India':              143467,
'Indonesia':          143476,
'Ireland':            143449,
'Israel':             143491,
'Italia':             143450,
'Korea':              143466,
'Kuwait':             143493,
'Lebanon':            143497,
'Luxembourg':         143451,
'Malaysia':           143473,
'Mexico':             143468,
'Nederland':          143452,
'New Zealand':        143461,
'Norway':             143457,
'Osterreich':         143445,
'Pakistan':           143477,
'Panama':             143485,
'Peru':               143507,
'Phillipines':        143474,
'Poland':             143478,
'Portugal':           143453,
'Qatar':              143498,
'Romania':            143487,
'Russia':             143469,
'Saudi Arabia':       143479,
'Schweiz/Suisse':     143459,
'Singapore':          143464,
'Slovakia':           143496,
'Slovenia':           143499,
'South Africa':       143472,
'Sri Lanka':          143486,
'Sweden':             143456,
'Taiwan':             143470,
'Thailand':           143475,
'Turkey':             143480,
'United Arab Emirates'  :143481,
'United Kingdom':     143444,
'United States':      143441,
'Venezuela':          143502,
'Vietnam':            143471,
'Japan':              143462,
'Dominican Republic': 143508,
'Ecuador':            143509,
'Egypt':              143516,
'Estonia':            143518,
'Honduras':           143510,
'Jamaica':            143511,
'Kazakhstan':         143517,
'Latvia':             143519,
'Lithuania':          143520,
'Macau':              143515,
'Malta':              143521,
'Moldova':            143523,
'Nicaragua':          143512,
'Paraguay':           143513,
'Uruguay':            143514
}

def getReviews(appStoreId, app):
    ''' returns list of reviews for given AppStore ID and application Id
        return list format: [{"title": unicode string, "review": unicode string, "rank": int}]
    '''
    reviews=[]
    i=0
    while True:
        ret = _getReviewsForPage(appStoreId, app, i)
        if len(ret)==0: # funny do while emulation ;)
            break
        reviews += ret
        i += 1
    return reviews

def _getReviewsForPage(appStoreId, app, pageNo):
    userAgent = 'iTunes/10.7 (Macintosh; U; Mac OS X 10.8)'
    front = "%d-1" % appStoreId
    appId = app["iosId"]
    url = "http://ax.phobos.apple.com.edgesuite.net/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=%s&pageNumber=%d&sortOrdering=4&onlyLatestVersion=false&type=Purple+Software" % (appId, pageNo)
    req = urllib2.Request(url, headers={"X-Apple-Store-Front": front,"User-Agent": userAgent})
    try:
        u = urllib2.urlopen(req, timeout=30)
    except urllib2.HTTPError:
        print "Can't connect to the AppStore, please try again later."
        raise SystemExit
    root = ElementTree.parse(u).getroot()
    reviews=[]
    for node in root.findall('{http://www.apple.com/itms/}View/{http://www.apple.com/itms/}ScrollView/{http://www.apple.com/itms/}VBoxView/{http://www.apple.com/itms/}View/{http://www.apple.com/itms/}MatrixView/{http://www.apple.com/itms/}VBoxView/{http://www.apple.com/itms/}VBoxView/{http://www.apple.com/itms/}VBoxView/'):
        review = {}
        review_node = node.find("{http://www.apple.com/itms/}TextView/{http://www.apple.com/itms/}SetFontStyle")
        if review_node is None:
            review["review"] = None
        else:
            review["review"] = review_node.text
        title_node = node.find("{http://www.apple.com/itms/}HBoxView/{http://www.apple.com/itms/}TextView/{http://www.apple.com/itms/}SetFontStyle/{http://www.apple.com/itms/}b")
        if title_node is None:
            review["title"] = None
        else:
            review["title"] = title_node.text

        version_node = node.find("{http://www.apple.com/itms/}HBoxView/{http://www.apple.com/itms/}TextView/{http://www.apple.com/itms/}SetFontStyle/{http://www.apple.com/itms/}GotoURL")
        if version_node is None:
            review["version"] = None
        else:
            review["version"] = re.search("Version [^\n^\ ]+", version_node.tail).group()
            review["url"] = version_node.get("url")
            review["date"] = re.search("Version .*(\n.*)+- \n(.*)", version_node.tail).group(2).strip()
            review_date = _get_date_from_string(review["date"])
            if review_date != date.today():
                break
        user_node = node.find("{http://www.apple.com/itms/}HBoxView/{http://www.apple.com/itms/}TextView/{http://www.apple.com/itms/}SetFontStyle/{http://www.apple.com/itms/}GotoURL/{http://www.apple.com/itms/}b")
        if user_node is None:
            review["user"] = None
        else:
            review["user"] = user_node.text.strip()

        rank_node = node.find("{http://www.apple.com/itms/}HBoxView/{http://www.apple.com/itms/}HBoxView/{http://www.apple.com/itms/}HBoxView")
        try:
            alt = rank_node.attrib['alt']
            st = int(alt.strip(' stars'))
            review["rank"] = st
        except KeyError:
            review["rank"] = None

        reviews.append(review)
    return reviews

def _get_date_from_string(datestring):
    response = datetime.today()
    for format in [ "%b %d, %Y", "%b %d, %Y", "%d-%b-%Y"]:
        try:
            response = datetime.strptime(datestring, format)
        except ValueError:
            pass
    return response.date()


def _get_datetime_from_string(datestring):
    response = datetime.today()
    for format in [ "%b %d, %Y", "%b %d, %Y", "%d-%b-%Y"]:
        try:
            response = datetime.strptime(datestring, format)
        except ValueError:
            pass
    return response


def _print_reviews(reviews, country, app):
    ''' returns (reviews count, sum rank)
        '''
    response = "\n"
    if len(reviews)>0:
        response += "Reviews in %s:\n" % (country)
        response += "\n"
        sumRank = 0
        reviewsJSON = []
        m = hashlib.sha1()
        for review in reviews:
            reviewData = _review_data(review, country, app)
            '''            hashId = reviewData["title"] + reviewData["version"] + reviewData["authorId"]
            m.update(hashId)
            reviewData["hashId"] = m.hexdigest()
            print "HashId: " + str(reviewData["hashId"])'''
            reviewsJSON.append(reviewData)
            sumRank += review["rank"]
        response += "Number of reviews in %s: %d, avg rank: %.2f\n\n" % (country, len(reviews), 1.0*sumRank/len(reviews))
    
        data = json.dumps({"comments" : reviewsJSON})
        print "REVIEW JSON : \n" + data
        request = urllib2.Request(server_url + 'reviews', data)
        request.add_header('Content-Type', 'application/json')
        response = urllib2.urlopen(request)
        jsonString = response.read()
    
        
        '''        print response.encode('utf-8')'''
        return (response, len(reviews), sumRank)
    else:
        return ("", 0, 0)


#review data

def unix_time(dt):
    epoch = datetime.utcfromtimestamp(0)
    delta = dt - epoch
    return delta.total_seconds()

def unix_time_millis(dt):
    return unix_time(dt) * 1000.0

def _review_data(review, country, app):
    data = {}
    data["title"] = review["title"].encode('utf-8')
    data["comment"] = review["review"].encode('utf-8')
    data["authorId"] = review["user"].encode('utf-8')
    data["url"] = review["url"]
    data["rating"] = review["rank"]
    dt = _get_datetime_from_string(review["date"])
    
    data["date"] = unix_time_millis(dt)
    data["version"] = review["version"].encode('utf-8')
    data["country"] = country
    data["appId"] = app["_id"]
    data["appName"] = app["name"]
    data["platform"] = platform
    
    return data;

def _get_apps():
    url = server_url + 'apps'
    response = urllib2.urlopen(url)
    jsonString = response.read()
    jsonResult = json.loads(jsonString)
    print jsonResult
    return jsonResult["apps"]


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='AppStoreReviewsScrapper command line.', epilog='To get your application Id look into the AppStore link to you app, for example http://itunes.apple.com/pl/app/autobuser-warszawa/id335042980?mt=8 - app Id is the number between "id" and "?mt=0"')
    parser.add_argument('-c', '--country', metavar='"Name"', type=str, default='all', help='AppStore country name (use -l to see them)')
    parser.add_argument('-l', '--list', action='store_true', default=False, help='AppStores list')
    args = parser.parse_args()
    country = string.capwords(args.country)
    countries=appStores.keys()
    countries.sort()
    if args.list:
        for c in countries:
            print c
    else:
        apps = _get_apps()
        for app in apps:
            if (country=="All"):
                rankCount = 0; rankSum = 0
                for c in countries:
                    reviews = getReviews(appStores[c], app)
                    (string, rc,rs) = _print_reviews(reviews, c, app)
                    rankCount += rc
                    rankSum += rs
                print "\nTotal number of reviews: %d, avg rank: %.2f" % (rankCount, 1.0 * rankSum/rankCount)
            else:
                try:
                    reviews = getReviews(appStores[country], app)
                    (string, rc, rs) = _print_reviews(reviews, country, app)
                except KeyError:
                    print "No such country %s!\n\nWell, it could exist in real life, but I dont know it." % country
                pass

