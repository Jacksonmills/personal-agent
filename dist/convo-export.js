"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const CONVO_FILE = 'convo.json';
if (fs_1.default.existsSync(CONVO_FILE)) {
    const jsonData = fs_1.default.readFileSync(CONVO_FILE, 'utf-8');
    const res = JSON.parse(jsonData);
    const output = res.map((m) => {
        if (m.role != "system") {
            return `${m.role}: ${m.content}`;
        }
        else {
            return "";
        }
    }).join("\n");
    console.log(output);
    // for (const m of res) {
    //   if (m.role != "system") {
    //     console.log(`${m.role}: ${m.content}`);
    //   }
    // };
}
else {
    console.log("NO CONVO");
}
