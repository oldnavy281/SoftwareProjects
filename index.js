// Key for Gmail: AIzaSyAiZZkTsNqFBWPJ4o2_jyo2mQF6p35uxCI

//AIzaSyCMkgmvMbk5O6KEEZM9lj1SeEDXoKlGGZY

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const express = require('express');
const pug = require('pug');
const routes = require('./routes/routes');
const path = require('path');
const { append } = require('express/lib/response');

const app = express();
const PORT = 3000;




// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', "https://www.googleapis.com/auth/pubsub"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), listLabels);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  gmail.users.labels.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const labels = res.data.labels;
    if (labels.length) {
      console.log('Labels:');
      labels.forEach((label) => {
        console.log(`- ${label.name}`);
      });
    } else {
      console.log('No labels found.');
    }
  });
}
/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
 async function listUnreadMsgs(auth) {
    var gmail = google.gmail({
        auth: auth,
        version: 'v1'
    });

    gmail.users.history.list({
        userId: "me",
        startHistoryId: 2982217,
        labelId: 'Label_8061975816208384485'
    }, async function (err, results) {
        // https://developers.google.com/gmail/api/v1/reference/users/history/list#response
        if (err) return console.log(err);
        const latest = await results.data.history[results.data.history.length - 1].messages;
        gmail.users.messages.get({
            userId: 'me',
            id: latest[latest.length - 1].id
        }, (err, res) => {
            if (res.data.labelIds.includes('UNREAD')) {
                console.log(res.data.snippet);
            } else {
                console.log('No unread messages here!');
            }
        });

    });
}

app.set('view engine', 'pug');
app.set('views', __dirname+ '/views');

app.get('/', routes.index);

// app.get('/', function(req, res){
//   res.send("AHHHHHHH");
// });


app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));