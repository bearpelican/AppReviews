# -*- coding: utf-8 -*-
require 'rubygems'
require 'jruby'
require 'net/http'
require 'net/https'
require 'json'

begin
    require 'supermarket'
    rescue LoadError
    `gem install supermarket`
end

$hostname = "http://localhost:3000/api/"

def paramsFromComment(app, comment)
    titleAndComments = comment["text"].split("\t")
    data = {
    	:title => titleAndComments[0],
    	:comment => titleAndComments[1],
    	:rating => comment["rating"],
    	:time => comment["creationTime"],
    	:authorName => comment["authorName"],
    	:authorId => comment["authorId"],
    	:platform => "Android",
    	:appId => app['_id'],
    	:appName => app['name']
    
    }
end

def getMarketRatings(app)
  session = Supermarket::Session.new
  jsonstring = session.comments(app['androidId']).to_json
  json = JSON.parse(jsonstring)
  json["comments"]
end


def saveComments(app, comments, last_sync_time)
  last_sync_time = 0 if last_sync_time.nil?
  new_sync_time = last_sync_time
  commentParams = []
  comments.reverse_each do |comment|
    if comment["creationTime"] > last_sync_time
        commentParams.push(paramsFromComment(app, comment))
        new_sync_time = comment["creationTime"]
    end
  end
  saveCommentsToServer(commentParams);
  new_sync_time
end

def saveCommentsToServer(comments)
  url = URI.parse($hostname + 'reviews')
  response = Net::HTTP.post_form(url, {"comments" => comments.to_json});
#  req = Net::HTTP::Post.new(url.path, initHeader = {'Content-Type' => 'application/json'})
#  req.set_form_data({"comments"  => comments})
#  puts req.form_data
#  res = Net::HTTP.start(url.host, url.port) {|http|
#    http.request(req)
#  }
end  

def saveSyncTime(app, last_sync_time)
  url = URI.parse($hostname + 'app/' + app['_id'])
  req = Net::HTTP::Put.new(url.path, initHeader = {'Content-Type' => 'application/json'})
  req.body = {"lastSyncTime" => last_sync_time}
  res = Net::HTTP.start(url.host, url.port) {|http|
    http.request(req)
  }
end

url = URI.parse($hostname + 'apps')
req = Net::HTTP::Get.new(url.path)
res = Net::HTTP.start(url.host, url.port) {|http|
  http.request(req)
}

json = JSON.parse(res.body)
apps = json["apps"]

apps.each do |app|
  puts app
  puts app['lastSyncTime']
  last_sync_time = app['lastSyncTime']
  comments = getMarketRatings(app)
  puts comments
  if comments.nil?
    puts "No Comments found"
  else
    last_sync_time = saveComments(app, comments, last_sync_time)
#    saveSyncTime(app, last_sync_time)
  end
end
