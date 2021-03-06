// const Discord = require('discord.js');
// const client = new Discord.Client();

// client.on('ready', () => {
//     console.log(`logged in as ${client.user.tag}`);
// });

// client.on("message", msg => {
//     if (msg.content === 'helo') {
//         msg.reply('eeeee');
//     }
// })

// client.login(process.env.TOKEN);


const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [{
    name: 'ping',
    description: 'Replies with Pong!'
}];

const rest = new REST({ version: '9' }).setToken('OTc5MTg1OTU3MDc1MDMwMTQ2.Gc7BUm.ALr92zcm2uLX7xFm3aGJ23G_aJZXgHMSlBffjo');

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();


const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

client.login('OTc5MTg1OTU3MDc1MDMwMTQ2.Gc7BUm.ALr92zcm2uLX7xFm3aGJ23G_aJZXgHMSlBffjo');
