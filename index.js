const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require("express");

const client = new Client({ checkUpdate: false });
const app = express();

const channel_id = process.env.channel; 
const guild_id = process.env.guild;     
const token = process.env.token;         

// --- [ التحكم في الكاميرا والستريم ] ---
const ENABLE_CAMERA = true;  // الكاميرا مفتوحة الآن
const ENABLE_STREAM = false; // الستريم مغلق حالياً (غيره لـ true لاحقاً لتفعيله)
// -------------------------------------

app.get('/', (req, res) => {
  res.send('<h1>Bot 24H Voice & Camera ON</h1>');
});

app.listen(process.env.PORT || 2000);

client.on('ready', async () => {
  console.log(`[+] Logged in as: ${client.user.username}`);

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
         client.user.setActivity("Live Streaming", { type: "STREAMING", url: "https://www.twitch.tv/discord" });
      } else {
         client.user.setPresence({ activities: [] }); // حذف حالة الستريم إذا كان مغلق
      }

    } catch (error) {
      console.log("Reconnecting...");
    }
  };

  stayInVoice();

  setInterval(() => {
    stayInVoice();
  }, 20000); 
});

client.login(token);
