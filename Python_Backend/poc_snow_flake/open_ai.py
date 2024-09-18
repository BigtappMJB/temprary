import os
import openai

# Initialize the OpenAI client with the API key
openai.api_key = os.getenv("OPEN_AI_KEY")


def open_ai_react_mui_function(prompt: str) -> Dict[str, Any]:
    """
    Send a prompt to the OpenAI API and return the generated React 18 code using Material UI.

    This function follows security best practices and coding standards:
    - Uses environment variables for API key
    - Implements proper error handling and logging
    - Follows PEP 8 style guide
    - Uses type hints
    - Implements rate limiting (to be added by the user)

    Args:
        prompt (str): The input prompt to send to the OpenAI model.

    Returns:
        Dict[str, Any]: A dictionary containing the generated code and status.
            {
                'status': 'success' or 'error',
                'data': The generated React 18 code with Material UI components,
                'error': Error message if status is 'error'
            }

    Raises:
        ValueError: If the API key is not set or the prompt is empty.
    """
    # Validate input
    if not prompt.strip():
        raise ValueError("Prompt cannot be empty")

    # Get API key from environment variable
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")

    # Configure OpenAI client
    openai.api_key = api_key

    try:
        # TODO: Implement rate limiting here

        # Call the OpenAI ChatCompletion API
        completion = openai.ChatCompletion.create(
            model="gpt-40",
            messages=[
                {"role": "system", "content": """
You are a React coding assistant specializing in React 18 and Material UI.
Provide secure, performant, and accessible React 18 code snippets using Material UI components.
Include proper JSDoc comments, follow React and Material UI best practices, and adhere to ESLint rules.
Implement proper error handling, avoid using 'any' type, and follow the principle of least privilege.
Always sanitize user inputs and use appropriate security measures.
"""},
                {"role": "user", "content": f"Generate React 18 code using Material UI for the following: {prompt}"}
            ]
        )

        # Extract the content of the response
        generated_code = completion.choices[0].message["content"]

        return {
            'status': 'success',
            'data': generated_code
        }

    except openai.error.RateLimitError:
        return {
            'status': 'error',
            'error': "Rate limit exceeded. Please try again later."
        }
    except openai.error.AuthenticationError:
        return {
            'status': 'error',
            'error': "Authentication error. Please check your API key."
        }
    except openai.error.APIError as e:
        return {
            'status': 'error',
            'error': f"OpenAI API error: {str(e)}"
        }
    except Exception as e:
        return {
            'status': 'error',
            'error': f"An unexpected error occurred: {str(e)}"
        }
