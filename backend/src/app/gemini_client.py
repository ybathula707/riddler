from google import genai
from google.genai import types
import base64 
# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client()

youtube_url = "https://youtu.be/loqCY9b7aec?si=4a1WaUR-nn3Th7qi"

def generate_video_summary_prompt(video_url: str) -> str:

    print(f"Generating summary for {video_url}")

    summary_response = client.models.generate_content(
        model='models/gemini-3-pro-preview',
        contents=types.Content(
            parts=[
                types.Part(
                    file_data=types.FileData(file_uri=video_url)
                ),
                types.Part(text='Please summarize the video by outlining the key points and most important information for a user interested in understanding the topic.')
            ]
        )
    )
    return summary_response.text

#generate_video_summary_prompt(youtube_url)



def generate_video_quiz_prompt(summary: str) -> str:
  summary_quiz_prompt = f"""
  You are a helpful teaching assistant.

  SUMMARY:
  {summary}
  """
  instruction_quiz_prompt = """
  Using ONLY the information in the summary above, create a reasonable number
  of multiple choice questions (about 3-5) that test understanding of the topic.

  For each question:
  - Provide 4 answer choices labeled A, B, C, D.
  - Clearly indicate which single option is correct.

  Return the response as VALID JSON ONLY, with no extra text, using this exact structure:

    {
    "questions": [
        {
        "id": "d4b20191-ec1b-45cd-b42c-5da4a5defab3",
        "content": "What is the capital of France?",
        "answers": [
            {
            "id": "da8b428c-8b35-445f-9fbf-e02eb23fb0f8",
            "content": "Paris",
            },
            {
            "id": "526a81e5-96bd-4c17-8090-c66462f55be3",
            "content": "London"
            },
            {
            "id": "3c9f8d2e-1a4b-4f7c-9e5d-8b2c6a1d9f3e",
            "content": "Berlin"
            }
        ],
        "correct_answers": [
            "da8b428c-8b35-445f-9fbf-e02eb23fb0f8"
        ]
        }
    ]
    }


  Rules:
  - Do not include any keys other than: "question", "answer", "correct_answers".
  - Do not include comments or trailing commas.
  - Do not wrap the JSON in backticks or any other formatting.
  - Return only JSON content
  """

  quiz_response = client.models.generate_content(
      model="models/gemini-3-pro-preview",
      contents=summary_quiz_prompt + instruction_quiz_prompt,
  )

  return quiz_response.text;


def generate_explanation_image(question_json:str):
   
   question_json_promt=f"""
   You are a helpful  education image generation assistant

   QUESTION JSON:
   {question_json}
   """
   expalanation_prompt="""
    Here is a json representing a quiz question presented to a user. 
    Please create a clear png depiciting the expalnation for why the correct answer is the right choice.
    The image should be clear, consise and straight forward in order to inform the user to learn quickly.
    """
   
   image_response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=question_json_promt+expalanation_prompt,
    # contents="question_json_promt+expalanation_prompt",
    )

   for part in image_response.parts:
        if part.text is not None:
            print(part.text)
        elif part.inline_data is not None:
            image = part.as_image()
            image.save("generated_image.png")
     
            with open("generated_image.png", "rb") as img_file:
                base64_image = base64.b64encode(img_file.read()).decode('utf-8')
                return base64_image 


q_example="""  "questions": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "content": "Why do the functions x² + 1 and x² + π have the exact same derivative?",
      "answers": [
        {
          "id": "c9e2b855-3d84-4866-9b16-5d2f6c91a8e1",
          "content": "Because the derivative of any constant number is zero."
        },
        {
          "id": "7b8f9e21-5a41-4d32-8c11-9e6f3b7d5a42",
          "content": "Because 1 and π are variables that change with x."
        },
        {
          "id": "1d4a6c8e-2f9b-4533-87a5-4e2c8d1f0b93",
          "content": "Because the anti-derivative cancels out the added numbers."
        },
        {
          "id": "8f3e5d7c-1b6a-4c92-9d4f-2a3b5c7e1f6d",
          "content": "Because the Indefinite Integral notation ignores addition."
        }
      ],
      "correct_answers": [
        "c9e2b855-3d84-4866-9b16-5d2f6c91a8e1"
      ]
    }"""
# base_64= generate_explanation_image(q_example)

# print(base64)
