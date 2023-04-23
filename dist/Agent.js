"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainAgent = exports.Agent = void 0;
const OpenAI_1 = require("./OpenAI");
const fs_1 = __importDefault(require("fs"));
const CONVO_FILE = 'convo.json';
class Agent {
    // memory: string;
    // convo: Msg[];
    // holdsConvo: boolean;
    // constructor(systemPrompts: string[], memory: string, holdsConvo: boolean) {
    constructor(systemPrompts) {
        this.systemPrompts = systemPrompts.map(OpenAI_1.systemMsg);
        // this.convo = [];
        // this.memory = memory;
        // this.holdsConvo = holdsConvo;
    }
    async sendMessage(message) {
        return this._sendMessage([(0, OpenAI_1.userMsg)(message)]);
        // if (this.holdsConvo) {
        //   return (async (): Promise<string> => {
        //     const response = await this._sendMessage(message);
        //     this.convo.push(agentMsg(response));
        //     return response;
        //   })();
        // } else {
        //   return this._sendMessage(message);
        // }
    }
    async _sendMessage(messages) {
        const response = await (0, OpenAI_1.openaiChat)([...this.systemPrompts, ...messages]);
        return response;
    }
}
exports.Agent = Agent;
class MainAgent extends Agent {
    constructor() {
        const personalityData = {
            'formality_level': 'informal',
            'verbosity_level': 'low',
            'sentence_structure': 'simple',
            'vocabulary_preference': 'everyday words',
            'punctuation_emoji_usage': 'minimal',
            'tone': 'casual',
            'idiomatic_expressions': ['no brainer', 'light on topics', 'fall into the $0-$1MM bucket'],
            'favorite_phrases': ['sounds good', 'yeah', 'lol', 'nice', 'ok'],
            'response_length': 'short',
            'question_frequency': 'low',
            'language_level': 'basic',
            'personality': { "H": 3.5, "E": 3.0, "X": 3.5, "A": 3.0, "C": 3.5, "O": 3.0 }
        };
        super([`
I want you to parse the following JSON object and use it to respond to the last message in this conversation.Please adjust your communication based on the JSON fields: formality_level, verbosity_level, sentence_structure, vocabulary_preference, punctuation_emoji_usage, tone, idiomatic_expressions, favorite_phrases, response_length, question_frequency, and language_level.Also, consider the personality values provided under the 'personality' key.When you provide the response, do not mention the JSON object or any possible responses.Avoid using repetitive greetings like "Hey!" at the beginning of each message.Simply respond in the most relevant way based on the given information.

${JSON.stringify(personalityData)}
    `]);
        this.convo = this.loadConversation();
    }
    async sendMessage(message) {
        this.convo.push((0, OpenAI_1.userMsg)(message));
        const response = await this._sendMessage(this.convo);
        this.convo.push((0, OpenAI_1.agentMsg)(response));
        return response;
    }
    saveConversation(convo) {
        fs_1.default.writeFileSync(CONVO_FILE, JSON.stringify(this.convo, null, 2));
    }
    loadConversation() {
        if (fs_1.default.existsSync(CONVO_FILE)) {
            const jsonData = fs_1.default.readFileSync(CONVO_FILE, 'utf-8');
            return JSON.parse(jsonData);
        }
        return [];
    }
}
exports.MainAgent = MainAgent;
// const tasks = [
//   {
//     title: 'Brainstorm new startup ideas',
//     description: 'Spend an hour brainstorming new ideas for your startup.',
//     tags: ['startup', 'productivity']
//   },
// ];
// async function extractTasks(): Promise<void> {
//   const history = convo.map((m) => {
//     if (m.role != "system") {
//       return `${m.role}: ${m.content}`;
//     } else {
//       return "";
//     }
//   }).join("\n");
//
//   const taskExtractPrompt = {
//     role: "system",
//     content: `Your job is to suggest tasks from the conversation provided below. It's important to consider the full context of the conversation and identify the tasks most important and relevant for the user. You should respond with a JSON array of possible todo list items. Each item should have a title, a description, and an array of relevant tags based on the conversation. When you provide the list of items, make sure they are clear and actionable. The user should be able to look at the list and know exactly what they need to do. Additionally, make sure to include any relevant tags that could help the user prioritize their tasks.
//
// It's very important you only respond with a JSON array that holds objects with three keys: title (string), description (string), and tags (array of strings). Do not include anything else in your response beside a valid JSON array of task objects.
//
//   ${history}
//   `
//   };
//
//
//   const response = await openai([taskExtractPrompt]);
//   try {
//     console.log(JSON.parse(response));
//   } catch (e) {
//     console.log(e);
//   }
// }
