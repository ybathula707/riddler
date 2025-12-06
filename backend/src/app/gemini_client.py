from google import genai
from google.genai import types

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


# quiz_prompt = f"""
# You are a helpful teaching assistant.

# Using ONLY the information in the summary below, create a reasonable number
# of multiple choice questions (about 5-8) that test understanding of the topic.

# For each question:
# - Provide 4 answer choices labeled A, B, C, D.
# - Clearly indicate which option is correct.

# Return the response as VALID JSON ONLY, with no extra text, using this exact structure:

# [
#   {
#     "question": "string",
#     "answer_choices": {
#       "A": "string",
#       "B": "string",
#       "C": "string",
#       "D": "string"
#     },
#     "correct_answer": "A"
#   }
# ]

# Rules:
# - Do not include any keys other than: "question", "answer_choices", "correct_answer".
# - Do not include comments or trailing commas.
# - Do not wrap the JSON in backticks or any other formatting.

# SUMMARY:
# {summary_response.text}
# """

# quiz_response = client.models.generate_content(
#     model="models/gemini-3-pro-preview",
#     contents=quiz_prompt,
# )

# print("\nQUIZ:\n", quiz_response.text)