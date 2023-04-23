"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Agent_1 = require("./Agent");
const readline_1 = __importDefault(require("readline"));
// # Tasks
// # UI
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
const agent = new Agent_1.MainAgent();
function promptUser() {
    rl.question('You: ', async (input) => {
        console.log(" ");
        console.log(`Bot: ${await agent.sendMessage(input)}`);
        promptUser();
    });
}
promptUser();
