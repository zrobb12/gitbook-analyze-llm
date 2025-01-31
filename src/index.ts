import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import logger from "./utils/logger";
import { Llm } from "./Llm";

const scrapGitBook = require("scrap-gitbook").default;

dotenv.config();

const start = async (gitbookUrl: string, outputFile: string) => {
  logger.info("LLM start");

  try {
    logger.data("scrap data...");
    await scrapGitBook(gitbookUrl, outputFile);
    logger.info("scrap data finish");

    const filePath = path.resolve(__dirname, "../result.md");
    const markdownContent = fs.readFileSync(filePath, "utf-8");

    const promptBase = `
    Here is an excerpt of text from a Markdown file. Read the text carefully and be ready to answer any questions that will be asked about it. Do not respond yet, wait for the question.

    Content:
    ${markdownContent}

    Now, I will ask you questions about this text.`;

    const chatgpt = new Llm(
      `${process.env.API}`,
      promptBase,
      "gpt-4o-mini",
      "chatgpt"
    );
    await chatgpt.start();
  } catch (error) {
    logger.error(error);
  }
};

const gitbookUrl = "https://docs.dodoex.io/en/home/what-is-dodo";
const outputFile = "result.md";

start(gitbookUrl, outputFile);
