import axios from "axios";
export const handleChatGPTResponse = async (prompt) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // Model choice
        messages: [
          {
            role: "system",
            content: `
            You are a React coding assistant specializing in React 18 and Material UI.
            Provide secure, performant, and accessible React 18 code snippets using Material UI components.
            Include proper JSDoc comments, follow React and Material UI best practices, and adhere to ESLint rules.
            Implement proper error handling, avoid using 'any' type, and follow the principle of least privilege.
            Always sanitize user inputs and use appropriate security measures.
            `
          },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`, // Secure access using environment variable
        },
      }
    );
    debugger;
    return response.data.choices[0].message.content;
  } catch (err) {
    throw err;
  }
};
