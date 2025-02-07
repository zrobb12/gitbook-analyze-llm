import OpenAI from "openai";
import readline from "readline";
import logger from "./utils/logger";
import { sleep } from "openai/core";

export class Llm {
  openai: OpenAI;
  rl: readline.Interface;
  messages: any;
  model: string;
    name: string;
  constructor(apiKey: string, promptBase: string, model: string, name: string) {
    this.model = model;
    this.name = name;
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

  async sendMarkdownChunks(markdownChunks: string[]) {
    let tokensUsed = 0;
    const MAX_TOKENS_PER_MIN = 40000;
    const MAX_REQUESTS_PER_MIN = 3;
    const TIME_BETWEEN_REQUESTS = 60 * 1000 / MAX_REQUESTS_PER_MIN; // 20s entre chaque requête

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const [index, chunk] of markdownChunks.entries()) {
        const chunkTokens = chunk.length;
        tokensUsed += chunkTokens;

        if (tokensUsed > MAX_TOKENS_PER_MIN) {
            console.log("⌛ Waiting for TPM reset...");
            await sleep(60 * 1000);
            tokensUsed = 0;
        }

        let retries = 0;
        const maxRetries = 5;

        while (retries < maxRetries) {
            try {
                console.log(`📤 Sending chunk ${index + 1}...`);
                await this.askQuestion(chunk);
                console.log(`✅ Chunk ${index + 1} sent!`);

                if (index < markdownChunks.length - 1) {
                    console.log(`⌛ Waiting ${TIME_BETWEEN_REQUESTS / 1000}s before next request...`);
                    await sleep(TIME_BETWEEN_REQUESTS);
                }
                break;
            } catch (error: any) {
                if (error.response?.status === 429) {
                    const retryAfter = parseInt(error.response.headers["retry-after"] || "20", 10) * 1000;
                    console.warn(`🚨 Rate limit exceeded. Retrying in ${retryAfter / 1000}s...`);
                    await sleep(retryAfter);
                    retries++;
                } else {
                    console.error("❌ Error sending chunk:", error);
                    throw error;
                }
            }
        }

        if (retries === maxRetries) {
            throw new Error("🚨 Max retries reached. OpenAI is still rate-limited.");
        }
    }
}

  async askQuestion(question: string) {
    this.messages.push({ role: "user", content: question });

     const completion = await this.openai.chat.completions.create({
      model: this.model,
      messages: this.messages,
      store: true,
    });

    const answer = completion.choices[0].message.content;
    logger.info(`<Bot ${this.name}> : ${answer}`);

    this.messages.push({ role: "assistant", content: answer });
  }

  async start() {
    this.rl.prompt();
    this.rl.on("line", async (input) => {
      await this.askQuestion(input);
      this.rl.prompt();
    });

    this.rl.on("SIGINT", () => {
      this.rl.question(`${this.name} Are you sure you want to exit? `, (answer) => {
        if (answer.match(/^y(es)?$/i)) this.rl.pause();
      });
    });
  }
}
