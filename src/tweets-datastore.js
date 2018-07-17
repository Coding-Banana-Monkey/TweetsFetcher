const https = require('https');
const url = require('url');
const moment = require('moment');
const fs = require('fs');
const config = require('./config');

const HOST = config.host;
const BAD_REST_API = config.badRestAPI;
const DATE_INCREMENT = config.dateIncrement;
const FIRST_DAY_INCLUSIVE = config.firstDay;
const LAST_DAY_EXCLUSIVE = config.lastDay;
const DOWNLOAD_DIR= config.downloadDir;

let counter = 0;

function sendRequest(start, end, lastDay) {
    const path = url.format({
        pathname: BAD_REST_API,
        query:{
            startDate : start.utc().format(),
            endDate : end.utc().format()
        }
    });
    const options = {
        protocol: 'https:',
        host: HOST,
        path: path,
        method: 'GET',
        headers: {
            accept: 'text/plain'
        }
    };
    const request = https.request(options, (res) => {
        let chunks = '';

        res.on('data', (chunk) => {
            chunks += chunk.toString();
        });

        res.on('end', () => {
            const tweets = JSON.parse(chunks);
            let lastStamp = moment(end).valueOf();

            counter += tweets.length;
            console.log(`[${new Date()}]: Finished fetching [${tweets.length}] tweets between [${start}] and [${end}].`);

            if (tweets.length !== 0) {
                if (tweets.length === 100) {
                    lastStamp = Date.parse(tweets[tweets.length - 1].stamp);
                }

                fs.writeFile(`${DOWNLOAD_DIR}/${start}_${end}.json`, chunks, (err) => {
                    if (err) {
                        throw err;
                    }
                });
            }

            if (lastStamp >= lastDay) {
                console.log(`Fetched [${counter}] tweets`);
                return;
            }

            let startTime = lastStamp;
            let endTime = moment(startTime).add(DATE_INCREMENT, 'days').valueOf();

            if (endTime > lastDay) {
                endTime = lastDay;
            }

            sendRequest(moment(startTime), moment(endTime), lastDay);
        });

    });

    request.end();
}

sendRequest(
    moment.utc(FIRST_DAY_INCLUSIVE),
    moment.utc(FIRST_DAY_INCLUSIVE).add(DATE_INCREMENT, 'd'),
    moment.utc(LAST_DAY_EXCLUSIVE).valueOf()
);

