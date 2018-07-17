const fs = require('fs');
const moment = require('moment');
const config = require('./config');

function validate(tweets, window) {
    for (let i = 0; i < tweets.length; i++) {
        const tweet = tweets[i];
        const milliSecs = moment(tweet.stamp);

        if (milliSecs < window.start || milliSecs >= window.end) {
            return false;
        }
    }

    return true;
}

function verify() {
    const window = {
        start: moment(config.firstDay).valueOf(),
        end: moment(config.lastDay).valueOf()
    };
    const actualData = JSON.parse(fs.readFileSync(config.tweetsFile));
    const expectedData = JSON.parse(fs.readFileSync(config.expectedFile));
    const isExpectedDataValid = validate(expectedData, window);

    if (!isExpectedDataValid) {
        console.log(`[${new Date()}]: The input has tweets beyond period between [${config.firstDay}] and [${config.lastDay}].`);

        return;
    }

    if (actualData.length !== expectedData.length) {
        console.log(`[${new Date()}]: The length of download data and input data is different.`);
        console.log(`[${new Date()}]: Download data: ${actualData.length}`);
        console.log(`[${new Date()}]: Input data: ${expectedData.length}`);

        return;
    }

    const map = actualData.reduce((pre, tweet) => {
        pre[tweet.id] = tweet;

        return pre;
    }, {});
    const isMatched = expectedData.reduce((pre, tweet) => {
        if (!map[tweet.id]) {
            console.log(`[${new Date()}]: Unmatched tweet found: [${tweet.id}]`);

            return false;
        }

        return pre && true;
    }, true);

    if (isMatched) {
        console.log(`[${new Date()}]: The download tweets are correct :)`);
    }
}

verify();

