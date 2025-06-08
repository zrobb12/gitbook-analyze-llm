# GitBook Analyze LLM

**LLM analyze GitBook and interact with prompt**

This project allows you to download GitBook documents and analyze them using a language model (LLM) like ChatGPT. Users can ask questions about the downloaded documentation via a terminal.

![Terminal GIF](image/termLlm.gif)

## Clone the Project

To get started, clone the project from GitHub:

```bash
git clone https://github.com/your-username/gitbook-analyze-llm.git

cd gitbook-analyze-llm
```

## Install dependencies

```bash
npm install
```

## Edit GitBook Url

Go to file index.ts and edit this section:

```typescript
const gitbookUrl = "https://your-new-gitbook-url.gitbook.io/";
const outputFile = "your-new-file-name.md";
```

## Run

After you can run the project

```bash
npm run build-run
```
