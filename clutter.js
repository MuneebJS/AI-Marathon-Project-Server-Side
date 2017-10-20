

'use strict';
const express = require('express')

const app = express()
const Speech = require('@google-cloud/speech');
const fs = require('fs');
const bodyparser = require('body-parser')
const language = require('@google-cloud/language');


// app.use(bodyparser.json())
app.use(bodyparser.json({ limit: '50mb' }));
// Your Google Cloud Platform project ID
const projectId = 'marathon-batch4';

// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});


const test = './resources/audio2.raw';
const test2 = fs.readFileSync(test);
const audioBytes = test2.toString('base64');
const audio = {
  content: audioBytes
};
const config = {
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  languageCode: 'en-US'
};
const request = {
  audio: audio,
  config: config
};


// app.get('/', function (req, res, next) {
//   console.log('/ path success')
//   speechClient.recognize(request)
//     .then((data) => {
//       const response = data[0];
//       const transcription = response.results.map(result =>
//       result.alternatives[0].transcript).join('\n');
//       res.send(`Transcription: ${transcription}`)
//     })
//     .catch((err) => {
//       console.error('ERROR:', err);
//     });
// })

var allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};

app.use(allowCrossDomain);
const client = new language.LanguageServiceClient();


app.post('/speechRec', function (req, res, next) {
  // console.log("req body", req.body.data)
  // res.send(req.body.data)
  const audio = {
    content: req.body.data
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US'
  };
  const request = {
    audio: audio,
    config: config
  };
  // request.audio =req.body.base64;
  speechClient.recognize(request)
    .then((data) => {
      const response = data[0];
      const transcription = response.results.map(result =>
      result.alternatives[0].transcript).join('\n');
      
      res.send({ transcription })
      // console.log(`sentiment ${transcription}`)
      // res.send(transcription)
      // sentiment analysis
      // client
      //   .analyzeSentiment({
      //     document: {
      //       content: transcription,
      //       type: 'PLAIN_TEXT',
      //     }
      //   })
      //     .then(results => {
      //       const sentiment = results[0].documentSentiment;
      //       res.send({
      //         transcript: transcription,
      //         score: sentiment.score,
      //         magnitude: sentiment.magnitude
      //       })

      //     })
      //     .catch(err => {
      //       console.error('ERROR:', err);
      //       res.send(`error occured ${err}`)
      //     });
        // res.send(request.audio)
      })
      .catch((err) => {
        console.error('ERROR:', err);
        res.send(`error occured ${err}`)
      });
    })



// analyze sentiment
app.post('/sentiment', function (req, res, next) {
  console.log("req body", req.body.data.text)
  client
    .analyzeSentiment({
      document: {
        content: req.body.data.text,
        type: 'PLAIN_TEXT',
      }
    })
    .then(results => {
      const sentiment = results[0].documentSentiment;
      // console.log(`Text: ${text}`);
      // console.log(`Sentiment score: ${sentiment.score}`);
      // console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
      res.send({
        score: sentiment.score,
        magnitude: sentiment.magnitude
      })
      // res.send(req.body)
    })
    .catch(err => {
      console.error('ERROR:', err);
    });

})

// Detects speech in the audio file
// speechClient.recognize(request)
//   .then((data) => {
//     const response = data[0];
//     const transcription = response.results.map(result =>
//         result.alternatives[0].transcript).join('\n');
//     console.log(`Transcription: ${transcription}`);
//   })
//   .catch((err) => {
//     console.error('ERROR:', err);
//   });


module.exports = app
