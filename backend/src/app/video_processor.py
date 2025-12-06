# In video_processor.py (generate_summaries function)
from .models.quiz import Quiz, db
from .gemini_client import generate_video_summary_prompt
def generate_summaries(quiz_id, context):
    # Move imports INSIDE function to avoid circular import
    print(f"generating summary")

    with context:
        print(f"found context")

        quiz = db.session.get(Quiz, quiz_id)
        generated_summary = generate_video_summary_prompt(video_url=quiz.video_url)
        print(f"summary: {generated_summary}")
        quiz.summary = generated_summary
        db.session.add(quiz)
        db.session.commit()
        

