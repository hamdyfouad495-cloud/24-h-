const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require("express");

const client = new Client({ checkUpdate: false });
const app = express();

const channel_id = process.env.channel; 
const guild_id = process.env.guild;     
const token = process.env.token;         

const ENABLE_CAMERA = true;  
const ENABLE_STREAM = false; 

app.get('/', (req, res) => {
  res.send('Online');
});

app.listen(process.env.PORT || 2000);

client.on('ready', async () => {
  console.log(`Logged in: ${client.user.username}`);

  const stayInVoice = async () => {
    try {
      const channel = await client.channels.fetch(channel_id);
      if (!channel) return;

      joinVoiceChannel({
        channelId: channel.id,
        guildId: guild_id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfMute: false,
        selfDeaf: false,
        selfVideo: ENABLE_CAMERA, 
      });

      if (ENABLE_STREAM) {
         client.user.setActivity("Live", { type: "STREAMING", url: "https://www.twitch.tv/discord" });
      }

    } catch (error) {
      // Auto-reconnect
    }
  };

  stayInVoice();

  setInterval(() => {
    stayInVoice();
  }, 20000); 
});

client.login(token);
