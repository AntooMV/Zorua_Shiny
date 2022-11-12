const axios = require('axios');
const tmi = require('tmi.js')
const config = require('./config.json')
const fs = require('fs')

/*GLOBAL EMOTES*/

var allEmotes = []

var ffzGlobal = ["AndKnuckles", "BeanieHipster", "BORT", "CatBag", "LaterSooner", "LilZ", "ManChicken", "OBOY", "OiMinna",
    "YooHoo", "ZliL", "ZrehplaR", "ZreknarF"]
console.log("Obtenidos los emotes de FrankerFaceZ")
allEmotes.push(...ffzGlobal)

axios.get('https://api.twitch.tv/helix/chat/emotes/global', {
    headers: {
        "Authorization": `Bearer ${config.TOKEN}`,
        "Client-Id": config.CLIENT_ID
    }
}).then(res => {
    twitchGlobal = res.data.data.map(emote => emote.name)
    console.log("Obtenidos los emotes de Twitch")
    allEmotes.push(...twitchGlobal)
}).catch(err => {
    console.log("No se pudieron obtener los emotes de Twitch") 
    console.log(err)
});

axios.get('https://api.betterttv.net/3/cached/emotes/global').then(res => {
    bttvGlobal = res.data.map(emote => emote.code)
    console.log("Obtenidos los emotes de BetterTTV")
    allEmotes.push(...bttvGlobal)
}).catch(err => {
    console.log("No se pudieron obtener los emotes de BetterTTV")
})

axios.get('https://api.7tv.app/v2/emotes/global').then(res => {
    seventvGlobal = res.data.map(emote => emote.name)
    console.log("Obtenidos los emotes de 7tv")
    allEmotes.push(...seventvGlobal)
}).catch(err => {
    console.log("No se pudieron obtener los emotes de 7tv")
})


/*CONEXION*/

var client = new tmi.Client({
    connection: {
        reconnect: true
    },
    identity: {
        username: config.username,
        password: config.password
    },
    channels: ["antoomv"]
});

const avisos = new Map();


/*CONEXION DEL BOT*/

client.connect();
client.on('connected', () => {
    console.log(`Bot conectado`)
});

/*MENSAJE EN EL CHAT*/

client.on('chat', (channel, tags, message, self) => {
    if (self) return;
    console.log(`${tags['display-name']}: ${message}`);

    var msgWords = message.split(/[\W_]+/g);
    var commandName = message.split(" ")[0];

    /*COMANDOS*/

    if (commandName.toLowerCase() === '!test') client.say(channel, `@${tags['display-name']} KEKW`)

    if (commandName.toLowerCase() === '!dado') {
        var dado = Math.floor(Math.random() * 6) + 1;
        var emote;
        if (dado > 4) emote = 'Clap';
        else if (dado > 3) emote = 'SeemsGood';
        else if (dado >= 2) emote = 'PauseMan';
        else emote = 'PepeLaugh';
        client.say(channel, `@${tags['display-name']} ha sacado un ${dado} ${emote}`);
    }


    if (commandName.toLowerCase() === '!pc') client.say(channel, `Intel Core i5 9300H | 
    Memoria RAM DDR IV 8GBx2 (2666MHz) |
    Disco duro 512GB NVMe PCIe SSD |
    Display 15.6" FHD (1920x1080), IPS-Level 120Hz |
    Gráfica NVIDIA RTX 2060, GDDR6 6GB |
    Windows 11`);


    if (commandName.toLowerCase() === '!pyramid') {
        var emoteToSpam = msgWords[2] + " "
        for (i = 0; i < 5; i++) client.say(channel, emoteToSpam.repeat(i));
        for (i = 5; i != 0; i--) client.say(channel, emoteToSpam.repeat(i));
    }

    if (commandName.toLowerCase() === '!emote') {
        var emote = msgWords[2]
        if(allEmotes.includes(emote)) client.say(channel, `peepoHappy Siii, lo tengo registrado, mira: ${emote}`)
        else client.say(channel, `peepoSad No lo tengo registrado, mira: ${emote}`)
    }

    if (commandName.toLowerCase() === '!remind') {
        var index = message.indexOf( ' ', message.indexOf( ' ' ) + 1 );
        var newReminder = {
                toUser: msgWords[2].toLowerCase(),
                fromUser: tags.username,
                text: message.substr( index + 1 )
        }
        fs.readFile('reminders.json', (err, data) => {
            if (err) console.log(err)
            var reminders = JSON.parse(data.toString())
            reminders.push(newReminder)
            newData = JSON.stringify(reminders)
            fs.writeFile('reminders.json', newData, (err) => {
                if (err) throw err;
                client.say(channel, `Se guardó el reminder para ${newReminder.toUser} -> ${newReminder.text}`)
              })
        })
    }

    if (commandName.toLowerCase() === '!reminders') {
        fs.readFile('reminders.json', (err, data) => {
            if (err) console.log(err)
            var reminders = JSON.parse(data.toString())
            var unreadReminders = reminders.filter(r => r.toUser != tags.username)
            reminders.forEach(r => {
                if (r.toUser === tags.username) {
                    client.say(channel, `${r.fromUser} -> ${r.toUser}: ${r.text}`)
                }
            })
            client.say(channel, 'Estás al día Okayge')
            newData = JSON.stringify(unreadReminders)
            fs.writeFile('reminders.json', newData, (err) => {
                if (err) console.log(err);
              })
        })
    }

    /*REMINDERS*/


    /*DETECTOR DE PALABRAS CLAVE*/

    msgWords.forEach(word => {

        if (word.toLowerCase() === 'zorua') {
            var num = Math.random();
            if (num >= 0.8) client.say(channel, `¿?`);
            else if (num >= 0.6) client.say(channel, `bruh ?`);
            else if (num >= 0.4) client.say(channel, `A mi no me hables, ${tags.username}`);
            else if (num >= 0.2) client.say(channel, `¿Quien me llamó? :)`);
            else client.say(channel, `¿Que quieres? @${tags.username}`);
        }
        if (word.toLowerCase() === '@zorua_shiny' || word.toLowerCase() === 'zorua_shiny') {
            client.say(channel, `No me pingees para tonterías peepoClown 🔔 @${tags.username}`);
        }

        if (config.bannedTerms.includes(word.toLowerCase())) {
            if (!avisos.has(tags.username)) {
                avisos.set(tags.username, 1);
                client.say(channel, `@${tags.username} cmonBruh WOAH`);
                client.deletemessage(channel, tags.id);
            }
            else if (avisos.get(tags.username) === 1) {
                client.timeout(channel, tags.username, 300);
                avisos.set(tags.username, 2);
                client.say(channel, `Para, @${tags.username} ✋ 4Weird Último aviso `);
            }
            else if (avisos.get(tags.username) === 2) {
                client.ban(channel, tags.username);
                avisos.set(tags.username, 2);
                client.say(channel, `OuttaPocket @${tags.username}`);
            }
        }
    });
});