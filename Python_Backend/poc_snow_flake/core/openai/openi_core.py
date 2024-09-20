
def openapi_function(prompt):
  from openai import OpenAI
  import os
  client = OpenAI(api_key= os.getenv("OPEN_AI_KEY"))

  stream = client.chat.completions.create(
      model="gpt-4o",
      messages=[ {"role": "system", "content": """
                  You are a React coding assistant specializing in React 18 and Material UI.
                  Provide secure, performant, and accessible React 18 code snippets using Material UI components.
                  Include proper JSDoc comments, follow React and Material UI best practices, and adhere to ESLint rules.
                  Implement proper error handling, avoid using 'any' type, and follow the principle of least privilege.
                  Always sanitize user inputs and use appropriate security measures.
              """},
                  {"role": "user", "content": prompt}
                ],
      stream=False,
  )
  # for chunk in stream:
  #     if chunk.choices[0].delta.content is not None:
  #         print(chunk.choices[0].delta.content, end="")
  return stream.choices[0].message.content
