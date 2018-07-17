TweetsFetcher
=

Introduction
-
This program is to fetch tweets between 2016-01-01 (inclusive) and 2018-01-01
(exclusive) by the following api:

``https://badapi.iqvia.io/api/v1/Tweets`` 

The api is designed badly such that it only returns first 100 tweets in the
time interval specified in the api. There is no pagination or other information to
know if there are more tweets following. 

The program is built upon this bad api to achieve fetching all tweets in a fair amount
of time.

Install
-
Pull in the repo

``git pull ``

Go to the root folder of the repo

``cd /your/path/to/TweetsFetcher``

Install node packages

``npm install``

Usage
-

### Download
After installation, you should be able to download tweets in 2016 and 2017. The download tweets will be stored in the 
file *tweets.json* under the root folder. 

Use the following command to download tweets:

``npm run download``

While downloading, the program prints out logs in the terminal.

### Verify

In order to verify the downloaded data, you have to prepare the expected data in a json file and name it *expected.json*.
Run the following command to verify the downloaded tweets:

``npm run verify``

