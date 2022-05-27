const Discord = require('discord.js');
const client = new Discord.Client();

exports.DIS = () =>{
    client.on('ready', () =>{
        console.log(`logged in as ${client.user.tag}`);
    });
    
    client.on("message", msg =>{
        if(msg.content === 'helo'){
            msg.reply('eeeee');
        }
    })
    
    client.login(process.env.OTc5MTg1OTU3MDc1MDMwMTQ2.Gc7BUm.ALr92zcm2uLX7xFm3aGJ23G_aJZXgHMSlBffjo);
}