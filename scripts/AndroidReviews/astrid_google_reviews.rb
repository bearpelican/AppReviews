#!/usr/bin/env jruby

require 'rubygems'
require 'bundler'
require 'net/http'
require 'net/https'

Bundler.require(:default)

session = Supermarket::Session.new

product_name = "com.timsu.astrid"
interval = 60 #minutes
json_file = File.join(File.expand_path(File.dirname(__FILE__)), "appreviewdata.json")

#flowdock params
debug = false 
if debug
    @flowdock_token = "8a5495694140ca667b81c1906ef108d4"
    else
    @flowdock_token = "a556125ef45f5abe2c023ef977f8148e"
end

@source = "Android App Store" #an readable identifier of the application that uses the Flowdock API
@from_address = "androidreview@astrid.com" #To show gravatar image, and email
@tags = "#applestorerankings" #flowdock tags

def flowdock_params(comment)
    titleAndComments = comment["text"].split("\t")
    rating = ""
    for i in 1..comment["rating"]
        rating += "*" #"★"
    end
    data = {
        :source => @source,
        :from => { :name => "#{rating}", :address => @from_address },
        :subject => titleAndComments[0],
        :content => "%s by %s on %s" % [titleAndComments[1], comment["authorName"], Time.at(comment["creationTime"]/1000).strftime('%d-%m-%Y %r')],
        :tags => @tags
    }
end

jsonstring = session.comments(product_name).to_json
json = JSON.parse(jsonstring)
comments = json["comments"]
flow = Flowdock::Flow.new(:api_token => @flowdock_token, :source => @source, :from => { :name => "Android", :address => @from_address })

if File.exists? json_file
    file_contents = File.read(json_file)
    last_sync_time = JSON.parse(file_contents)["last_sync_time"]
end
last_sync_time = 0 if last_sync_time.nil?
new_sync_time = last_sync_time
comments.reverse_each do |comment|
    if comment["creationTime"] > last_sync_time
        flow.push_to_team_inbox(flowdock_params(comment))
        new_sync_time = comment["creationTime"]
    end
end

File.open(json_file,"w") do |f|
    f.write({ :last_sync_time => new_sync_time }.to_json)
end


