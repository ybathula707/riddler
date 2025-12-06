from google import genai
from google.genai import types

# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client()

youtube_url = "https://youtu.be/loqCY9b7aec?si=4a1WaUR-nn3Th7qi"

def generate_video_summary_prompt(video_url: str) -> str:

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
    #print(summary_response.text)
    return summary_response.text

#generate_video_summary(youtube_url)


quiz_prompt = f"""
You are a helpful teaching assistant.

SUMMARY:
{summary_response.text}

Using ONLY the information in the summary above, create a reasonable number
of multiple choice questions (about 3-5) that test understanding of the topic.

For each question:
- Provide 4 answer choices labeled A, B, C, D.
- Clearly indicate which single option is correct.

Return the response as VALID JSON ONLY, with no extra text, using this exact structure:

"questions": [
  {
    "id": "d4b20191-ec1b-45cd-b42c-5da4a5defab3",
    "content": "What is the capital of France?",
    "answers": [
      {
          "id": "da8b428c-8b35-445f-9fbf-e02eb23fb0f8",
          "content": "Paris"
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
    "correct_answers": ["da8b428c-8b35-445f-9fbf-e02eb23fb0f8"]
  }
]

Rules:
- Do not include any keys other than: "question", "answer", "correct_answers".
- Do not include comments or trailing commas.
- Do not wrap the JSON in backticks or any other formatting.
- Return only JSON content
"""

quiz_response = client.models.generate_content(
    model="models/gemini-3-pro-preview",
    contents=quiz_prompt,
)

print("\nQUIZ:\n", quiz_response.text)