"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenCount = exports.openaiChat = exports.systemMsg = exports.agentMsg = exports.userMsg = void 0;
const axios_1 = __importDefault(require("axios"));
const { encode } = require('gpt-3-encoder');
const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = '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';
function userMsg(message) {
    return { role: "user", content: message };
}
exports.userMsg = userMsg;
function agentMsg(message) {
    return { role: "assistant", content: message };
}
exports.agentMsg = agentMsg;
function systemMsg(message) {
    return { role: "system", content: message };
}
exports.systemMsg = systemMsg;
async function openaiChat(messages) {
    let requestBody = {
        "model": "gpt-3.5-turbo",
        "messages": messages
    };
    const response = await axios_1.default.post(API_URL, requestBody, {
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        }
    });
    return response.data.choices[0].message.content.trim();
}
exports.openaiChat = openaiChat;
function getTokenCount(convo) {
    let totalTokens = 0;
    for (const m of convo) {
        totalTokens += encode(`${m.role}: ${m.content}`).length;
    }
    return totalTokens;
}
exports.getTokenCount = getTokenCount;
