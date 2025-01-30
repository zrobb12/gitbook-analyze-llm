import OpenAI from "openai";
import readline from "readline";
import logger from "./utils/logger";

export class DeepSeek {
  openai: OpenAI;
  rl: readline.Interface;
  messages: any;
  model: string;
  constructor(apiKey: string, promptBase: string, model: string) {
    this.model = model;
    this.openai = new OpenAI({ apiKey });
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: "> ",
    });

    this.messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: promptBase },
    ];
  }

  async askQuestion(question: string) {
    this.messages.push({ role: "user", content: question });

     const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages: this.messages,
      store: true,
    });

    const answer = completion.choices[0].message.content;
    logger.info(`<Bot> : ${answer}`);

    this.messages.push({ role: "assistant", content: answer });
  }

  async start() {
    this.rl.prompt();
    this.rl.on("line", async (input) => {
      await this.askQuestion(input);
      this.rl.prompt();
    });

    this.rl.on("SIGINT", () => {
      this.rl.question("Are you sure you want to exit? ", (answer) => {
        if (answer.match(/^y(es)?$/i)) this.rl.pause();
      });
    });
  }
}
