const fs = require('fs');
const moment = require('moment');
const config = require('./config');

const folder = config.downloadDir;
const start = moment.utc(config.firstDay).valueOf();
const end = moment.utc(config.lastDay).valueOf();
const tweetsFile = config.tweetsFile;

fs.readdir(folder, (err, files) => {
    let tweets = [];
    const map = {};

    files.forEach((file) => {
        const data = fs.readFileSync(`${folder}/${file}`, { encoding: 'utf8' });

        tweets = tweets.concat(JSON.parse(data));
    });

    console.log(`[${new Date()}]: Read ${tweets.length} tweets.`);


    tweets.sort((a, b) => Date.parse(a.stamp) - Date.parse(b.stamp));
    tweets.forEach(((tweet) => {
        if (tweet.stamp < start || tweet.stamp >= end) {
            console.log(`Invalid: ${JSON.stringify(tweet)}`);
        } else if (map[tweet.id]) {
            console.log(`Duplicate: ${JSON.stringify(tweet)}`);
        } else {
            map[tweet.id] = tweet;
        }
    }));

    const result = Object.values(map);
    fs.writeFileSync(tweetsFile, JSON.stringify(result));
    console.log(`[${new Date()}]: Stored ${result.length} tweets`);
});