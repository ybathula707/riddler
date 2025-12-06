from .gemini_client import generate_video_summary_prompt


def generate_summaries(video_url: str) -> str:
        summary=generate_video_summary_prompt(video_url=video_url)
        return summary

