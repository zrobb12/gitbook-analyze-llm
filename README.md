# GitBook Q&A LLM Interactive CLI

This project scrapes the full content of a GitBook and enables you to interactively ask questions about it using an LLM (Venice API), even for large documents.  
It works by chunking the content, querying each chunk, and then synthesizing the best answer.

---

## Features

- Scrapes and converts an entire GitBook to Markdown.
- Splits the content into manageable chunks.
- Uses the Venice LLM API to answer questions about the entire GitBook.
- Synthesizes the best or most complete answer from all content.

---

## Installation

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone <your-repo-url>
   cd <your-repo-directory>
   ```

2. **Install dependencies**:

   ```bash
   npm install
   npm install node-fetch dotenv
   ```

3. **Set up your environment variables**:

   - Create a `.env` file in your project root:
     ```
     API=your_venice_api_key_here
     ```

4. **(Optional) Check `.gitignore`**:

   Make sure `.env` is listed in your `.gitignore` so your API key is never committed.

---

## Usage

1. **Run the CLI:**

   ```bash
   npx ts-node src/index.ts
   ```

2. **Ask questions interactively**:

   - You will be prompted to ask a question about the GitBook content.
   - Type your question and press Enter.
   - The program will process your question across all content and show the best answer.
   - Type `exit` to quit.

---

## Notes

- The default GitBook URL is set to `https://nftguessr.gitbook.io/`. To use another GitBook, change the `gitbookUrl` variable in `src/index.ts`.
- Make sure your API key and network can access the Venice API endpoint.
- The program will only display the synthesized best answer for your question.

---

## Example

```bash
$ npx ts-node src/index.ts
Ask a question about the FULL GitBook content (or type 'exit' to quit):
> What is NFTGuessr about?

=== Best answer: ===

NFTGuessr is ...
```

---

## License

MIT
