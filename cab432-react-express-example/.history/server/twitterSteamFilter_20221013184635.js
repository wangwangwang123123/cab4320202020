// Open a realtime stream of Tweets, filtered according to rules
// https://developer.twitter.com/en/docs/twitter-api/tweets/filtered-stream/quick-start

const needle = require('needle')
const express = require('express')
const router = express.Router()
const axios = require('axios');
const redis = require('redis');

require('dotenv').config();

const bucketName = 'n10642536-twitter-store';

const AWS = require('aws-sdk');


const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token =
    'AAAAAAAAAAAAAAAAAAAAAPO%2BhwEAAAAAyd%2FshOJ1k5CBagh6Bt%2BHn0VMG2w%3Dsjzhv7EJudSEZMO1HWQoHW5wq33FbTDCTNWi1ZYYT0LI1IAo4J';


const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const streamURL = 'https://api.twitter.com/2/tweets/search/stream';


// Edit rules as desired below
 const rules = [
    /* {
        'value': 'dog has:images -is:retweet lang:en',
        'tag': 'dog pictures'
    } */
]; 
/* router.get('/', (req, res) => {

    (async () => {
        let currentRules
        try {
            // Gets the complete list of rules currently applied to the stream
            currentRules = []
            console.log("rule+    ")
            console.log(currentRules)
            console.log("1")
            // Delete all rules. Comment the line below if you want to keep your existing rules.
            await deleteAllRules(currentRules);
            console.log("2")
            // Add rules to the stream. Comment the line below if you don't want to add new rules.
            await setRules(rules);
            console.log("3")
        } catch (e) {
            console.log("error")
            console.error(e);
            process.exit(1);

        }

        // Listen to the stream.
        streamConnect(0, currentRules);

    })();

})
 */

router.get('/', (req, res) => {
      /*   let currentRules = []
        setRules(currentRules) */
        let currentRules = getAllRules()
        currentRules.then(res=>{
            streamConnect(0, res.data.tag===undefined? " ": );
        })
        //streamConnect(0, res.data.tag);
})

/* router.get('/add/:query', (req, res) => {
    const tag = req.params.query
    console.log(tag)
    const rules = [
        {
            'value': `${tag} -is:retweet lang:en`,
            'tag': `${tag}`
        }
    ];
    (async () => {
        let currentRules
        try {
            // Gets the complete list of rules currently applied to the stream
            currentRules = await getAllRules();
            console.log("rule+    ")
            console.log(currentRules)
            console.log("1")
            // Delete all rules. Comment the line below if you want to keep your existing rules.
            await deleteAllRules(currentRules);
            console.log("2")
            // Add rules to the stream. Comment the line below if you don't want to add new rules.
            await setRules(rules);
            console.log("3")
        } catch (e) {
            console.log("error")
            console.error(e);
            process.exit(1);
        }
    })();
    res.send("successfully")

}) */

router.get('/add/:query', (req, res) => {
    const tag = req.params.query
    const rules = [
        {
            'value': `${tag} -is:retweet lang:en`,
            'tag': `${tag}`
        }
    ];
    setRules(rules)
    res.send("successfully")
})

router.get('/delete', (req, res) => {
    (async () => {
        try {
            
            console.log("delete!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
            let currentRules = getAllRules() 
            currentRules.then(res=>{
                console.log(res.data.tag)
                console.log(res.data[0].id)
                 deleteAllRules(res.data[0].id);
            })
            // Delete all rules. Comment the line below if you want to keep your existing rules.
         
        } catch (e) {
            console.log("error")
            console.error(e);
            process.exit(1);
        }
    })();
    res.send("successfully")

})

// this sets up two rules - the value is the search terms to match on, and the tag is an identifier that
// will be applied to the Tweets return to show which rule they matched
// with a standard project with Basic Access, you can add up to 25 concurrent rules to your stream, and
// each rule can be up to 512 characters long



async function getAllRules() {
    console.log("2222222222222222222222222222222222222222")
    const response = await needle('get', rulesURL, {
        headers: {
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 200) {
        console.log("Error:", response.statusMessage, response.statusCode)
        throw new Error(response.body);
    }
   


    return (response.body);
}


async function deleteAllRules(id) {
 

    console.log(id)
    const data = {
        "delete": {
            "ids": [`${id}`]
        }
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 200) {
        throw new Error(response.body);
    }


   
}
/* async function deleteAllRules(rules) {
    if (!Array.isArray(rules.data)) {
        return null;
    }
    const ids = rules.data.map(rule => rule.id);
    console.log(ids)
    const data = {
        "delete": {
            "ids": ids
        }
    }

    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 200) {
        throw new Error(response.body);
    }

    return (response.body);

} */

async function setRules(rules) {
    const data = {
        "add": rules
    }
    const response = await needle('post', rulesURL, data, {
        headers: {
            "content-type": "application/json",
            "authorization": `Bearer ${token}`
        }
    })

    if (response.statusCode !== 201) {
        throw new Error(response.body);
    }

    return (response.body);

}

function streamConnect(retryAttempt, tag) {
    const stream = needle.get(streamURL, {
        headers: {
            "User-Agent": "v2FilterStreamJS",
            "Authorization": `Bearer ${token}`
        },
        timeout: 20000
    });

    stream.on('data', data => {
        try {
            const tweet = JSON.parse(data);
            console.log(tweet);
           // const tag = currentRules.data[0].tag;
            const s3Key = `${tag}`
            const redisKey = `${tag}`
            const params = { Bucket: bucketName, Key: s3Key };
            // const newTweet = JSON.stringify({ 
            //     tweet, 
            // }); 

            s3.getObject(params)
                .promise()
                .then((result) => {
                    const resultJSON = JSON.parse(result.Body);
                    // console.log("tweet")
                    // console.log(tweet)
                    // console.log("resultJSON")
                    // console.log(resultJSON)
                    const body = JSON.stringify([tweet.data, ...resultJSON]);
                    // console.log("body")
                    // console.log(body)
                    const objectParams = { Bucket: bucketName, Key: s3Key, Body: body };
                    s3.putObject(objectParams)
                        .promise()
                        .then(() => {
                            console.log(
                                `Successfully uploaded data to ${bucketName}/${s3Key}`
                            );
                        });
                })

                .catch((err) => {
                    if (err.statusCode === 404) {
                        let body = JSON.stringify([tweet.data]);
                        const objectParams = { Bucket: bucketName, Key: s3Key, Body: body };
                        s3.putObject(objectParams)
                            .promise()
                            .then(() => {
                                console.log(
                                    `Successfully uploaded data to ${bucketName}/${s3Key}`
                                );
                            });
                    } else {
                        console.log(err)
                    }
                })
            // A successful connection resets retry count.
            retryAttempt = 0;
        } catch (e) {
            if (data.detail === "This stream is currently at the maximum allowed connection limit.") {
                console.log(data.detail)
                process.exit(1)
            } else {
                console.log(e)
                // Keep alive signal received. Do nothing.
                console.log('errorrr!')
            }
        }
    }).on('err', error => {
        if (error.code !== 'ECONNRESET') {
            console.log(error.code);
            process.exit(1);
        } else {
            // This reconnection logic will attempt to reconnect when a disconnection is detected.
            // To avoid rate limits, this logic implements exponential backoff, so the wait time
            // will increase if the client cannot reconnect to the stream. 
            setTimeout(() => {
                console.warn("A connection error occurred. Reconnecting...")
                streamConnect(++retryAttempt);
            }, 2 ** retryAttempt)
        }
    });
    function store(tweet, currentRules) {


    }
    return stream;

}




module.exports = router;