const express = require('express')
const router = express.Router()
const redis = require('redis');
require('dotenv').config();
const bucketName = 'n10642536-twitter-store';

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
var Analyzer = require('natural').SentimentAnalyzer;
var stemmer = require('natural').PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
const redisClient = redis.createClient();
redisClient.connect()
    .catch((err) => {
        console.log(err);
    });

router.get('/', (req, res) => {
    const tag = req.
    const s3Key = `${tag}`
    const redisKey = `${tag}`
    const params = { Bucket: bucketName, Key: s3Key };

    redisClient.get(redisKey).then((result) => {
        if (result) {
            // Serve from redis 
            const resultJSON = JSON.parse(result);
            res.json({ source: "Redis Cache", ...resultJSON });
        } else {
            s3.getObject(params)
                .promise()
                .then((result) => {
                    const resultJSON = JSON.parse(result.Body);
                    console.log(resultJSON)
                    resultJSON.map((list) => {
                        const text = list.text;
                        const splitWord = text.split(" ");

                        let sentiment;
                        if (analyzer.getSentiment(splitWord) > 0) {
                            sentiment = "positive"
                        } else if (analyzer.getSentiment(splitWord) < 0) {
                            sentiment = "nagetive"
                        } else {
                            sentiment = "emotionless"
                        }
                        list.sentiment = sentiment
                    })
                    redisClient.setEx(
                        redisKey,
                        3600,
                        JSON.stringify(resultJSON)
                    );
                    res.json({ source: "s3 ", ...resultJSON })
                }

                )
                .catch((err) => {
                    if (err.statusCode === 404) {
                        console.log("not exit")
                    } else {
                        console.log(err)
                    }
                })
            // }
        }


    })
})


module.exports = router;