const fs = require('fs');
const http = require('http');
const readline = require('readline');
const gmail = require(`@googleapis/gmail`);

// const auth = new gmail.auth.GoogleAuth({
//     keyFilename: '',
//     scopes: ['']
// });


const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly',"https://www.googleapis.com/auth/pubsub"];
const TOKEN_PATH = 'token.json';

fs.readFile('creditials.json',(err, content) =>{
    if(err) return console.log('message goes here', err);
    authorize(JSON.parse(content), (auth) =>{
        listUnreadMsgs(auth), watchMyLabel(auth)
    });
});

// @param {Object}
// @param {function}

function authorize(creditials, callback){
    const {
        client_secret,
        client_id,
        redirect_uris
    } = creditials.installed;
    const oAuth2Client = new google.auth.oAuth2(
        client_id, client_secret, redirect_uris[0]
    );

    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
    });
}

function getNewToken(oAuth2Client, callback){
    const authURL = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    rl.question('message here:', (code) =>{
        rl.close();
        oAuth2Client.getToken(code, (err, token) =>{
            if(err) return console.error('error', err);
            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) =>{
                if(err) return console.error(err);
                console.log('token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

async function listUnreadMsgs(auth){
    var gmail = google.gmail({
        auth: auth,
        version: 'v1'
    });

    gmail.users.history.list({
        userId: 'me',
        startHistoryId: 2982217,
        labelId: 'Label_8061975816208384485'
    }, async function (err, results){
        if(err) return console.log(err);
        const latest = await results.data.history[results.data.history.length -1].messages;
        gmail.users.messages.get({
            userId:'me',
            id: latest[latest.length -1].id
        }, (err, res) => {
            if (res.data.labelIds.includes('UNREAD')){
                console.log(res.data.snippet);
            }else{
                console.log("no unread Messages here!");
            }
        });
    });
}

async function watchMyLabel(auth){
    const gmail = google.gmail({
        version: 'v1',
        auth
    });
    const res = await gmail.users.watch({
        userId: 'me',
        requestBody: {
            labelIds: ['Label_8061975816208384485', 'UNREAD'],
            labelFilterAction: 'include',
            topicName: 'projects/quickstart-1593237046786/topics/notifications'
        }
    })
}
// Key for Gmail: AIzaSyAiZZkTsNqFBWPJ4o2_jyo2mQF6p35uxCI