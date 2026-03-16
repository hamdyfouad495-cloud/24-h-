const { Client } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require("express");

const client = new Client();
const app = express();

// --- الإعدادات ---
const CHANNEL_ID = process.env.channel;
const GUILD_ID = process.env.guild;
const TOKEN = process.env.token;

// إعدادات الكاميرا والستريم (غير لـ true لتفعيلها)
const ENABLE_CAMERA = false; 
const ENABLE_STREAM = false; 
// ----------------

// سرفر داخلي لإبقاء البوت يعمل 24 ساعة (Uptime)
app.get('/', (req, res) => res.send('Bot is Running 24/7!'));
app.listen(process.env.PORT || 2000);

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.username}`);

    // وظيفة الاتصال بالفويس
    const connect = async () => {
        try {
            const channel = await client.channels.fetch(CHANNEL_ID);
            if (!channel) return console.error("لم يتم العثور على القناة!");

            const connection = joinVoiceChannel({
                channelId: channel.id,
                guildId: GUILD_ID,
                adapterCreator: channel.guild.voiceAdapterCreator,
                selfMute: false, // كتم المايك
                selfDeaf: false, // كتم السماعة
                selfVideo: ENABLE_CAMERA, // تفعيل الكاميرا
            });

            // تفعيل الستريم إذا كان الخيار true
            if (ENABLE_STREAM) {
                // ملاحظة: الـ selfbot-v13 يدعم الستريم عبر هذه الطريقة في بعض النسخ
                client.user.setPresence({ activities: [{ name: 'Streaming...', type: 'STREAMING', url: 'https://twitch.tv/discord' }] });
            }

            console.log("تم الدخول إلى الفويس بنجاح.");
        } catch (e) {
            console.error("خطأ في الاتصال:", e.message);
        }
    };

    // الدخول عند التشغيل
    connect();

    // فحص الاتصال كل 30 ثانية بدلاً من ثانية واحدة (لتجنب الحظر)
    setInterval(() => {
        connect();
    }, 30000); 
});

client.login(TOKEN);
