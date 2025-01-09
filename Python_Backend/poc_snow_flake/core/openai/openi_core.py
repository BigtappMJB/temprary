
def openapi_function(prompt):

    import openai
    import os

    # Initialize the OpenAI client with the API key from environment variable
    openai.api_key = os.getenv("OPEN_AI_KEY")

    # temperature=0.7
    # max_tokens=300
    # top_p=1
    # frequency_penalty=0
    # presence_penalty=0
    stream=False
    # Create a chat completion using the GPT-4 model with additional parameters for control
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": """
                You are a React coding assistant specializing in React 18 and Material UI.
                Provide secure, performant, and accessible React 18 code snippets using Material UI components.
                Include proper JSDoc comments, follow React and Material UI best practices, and adhere to ESLint rules.
                Implement proper error handling, avoid using 'any' type, and follow the principle of least privilege.
                Always sanitize user inputs and use appropriate security measures.
            """},
            {"role": "user", "content": prompt}
        ],
        
        # temperature=temperature,        # Controls randomness
        # max_tokens=max_tokens,          # Limits response length
        # top_p=top_p,                    # Nucleus sampling
        # frequency_penalty=frequency_penalty,  # Reduces repetitive text
        # presence_penalty=presence_penalty,    # Encourages new topics
        # stream=stream,                  # Set stream to True or False
    )

    if stream:
        # Handle streaming response
        full_response = ""
        for chunk in response:
            if "choices" in chunk and "delta" in chunk.choices[0]:
                # Collect content from each chunk
                content_part = chunk.choices[0].delta.get("content", "")
                full_response += content_part
                print(content_part, end="")  # Output the streamed content as it comes
        return full_response
    else:
        # Return the full response in one go
        return response.choices[0].message.content
    
    


def express_geneartor(prompt):

    import openai
    import os

    # Initialize the OpenAI client with the API key from environment variable
    openai.api_key = os.getenv("OPEN_AI_KEY")

    # temperature=0.7
    # max_tokens=300
    # top_p=1
    # frequency_penalty=0
    # presence_penalty=0
    stream=False
    # Create a chat completion using the GPT-4 model with additional parameters for control
    response = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": """
               You are an Express.js  coding assistant specializing in building secure, performant, and maintainable Express APIs.
            Provide concise and well-structured code snippets for CRUD (Create, Read, Update, Delete) HTTP APIs using Express.js, focusing exclusively on API logic and routes.
            Follow best practices for Express and RESTful API design, including:
            - Input validation using libraries like express-validator.
            - Data sanitization to prevent SQL Injection, XSS, and other common vulnerabilities.
            - Adhere coding standards and avoid vulnerability.
            Write clean, modular, and reusable code that adheres to ESLint and Prettier rules.
            Include proper comments and documentation using JSDoc for better code readability and maintainability.
            """},
            {"role": "user", "content": prompt}
        ],
        
        # temperature=temperature,        # Controls randomness
        # max_tokens=max_tokens,          # Limits response length
        # top_p=top_p,                    # Nucleus sampling
        # frequency_penalty=frequency_penalty,  # Reduces repetitive text
        # presence_penalty=presence_penalty,    # Encourages new topics
        # stream=stream,                  # Set stream to True or False
    )

    if stream:
        # Handle streaming response
        full_response = ""
        for chunk in response:
            if "choices" in chunk and "delta" in chunk.choices[0]:
                # Collect content from each chunk
                content_part = chunk.choices[0].delta.get("content", "")
                full_response += content_part
                print(content_part, end="")  # Output the streamed content as it comes
        return full_response
    else:
        # Return the full response in one go
        return response.choices[0].message.content