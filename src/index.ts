import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import logger from "./utils/logger";
import { Llm } from "./Llm";

const scrapGitBook = require("scrap-gitbook").default;

dotenv.config();

const getSrapping = async (gitbookUrl: string, outputFile: string) => {
  try {
    logger.data("Process scrapping...");

    await scrapGitBook(gitbookUrl, outputFile);

    logger.info("finish scrapping successfull");

    const filePath = path.resolve(__dirname, "../result.md");
    return fs.readFileSync(filePath, "utf-8");
  } catch (error) {
    logger.error(error);
  }
};

function splitTextIntoChunks(text: string, maxTokens = 4000): string[] {
  const words = text.split(" ");
  let chunks: string[] = [];
  let chunk = "";

  for (const word of words) {
      if ((chunk + word).length > maxTokens) {
          chunks.push(chunk);
          chunk = "";
      }
      chunk += word + " ";
  }
  if (chunk) chunks.push(chunk);
  return chunks;
}

const start = async (gitbookUrl: string, outputFile: string) => {
  logger.info("LLM start");

  try {
    const markdownContent = await getSrapping(gitbookUrl, outputFile);
    const markdownChunksSplit = splitTextIntoChunks(`${markdownContent}`);

    const promptBase = `
    Here is an excerpt of text from a Markdown file. Read the text carefully and be ready to answer any questions that will be asked about it. Do not respond yet, wait for the question.

    Content:
    ${markdownContent}

    Now, I will ask you questions about this text.`;

    const chatgpt = new Llm(
      `${process.env.API}`,
      promptBase,
      "venice-uncensored",   // <-- Venice model name
      "venice"
    );
    await chatgpt.start();
  } catch (error) {
    logger.error(error);
  }
};

const gitbookUrl = "https://nftguessr.gitbook.io/";
const outputFile = "result.md";

start(gitbookUrl, outputFile);
