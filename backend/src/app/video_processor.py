# In video_processor.py (generate_summaries function)
from .models.quiz import Quiz, db
from .gemini_client import generate_video_summary_prompt, generate_video_quiz_prompt

def generate_summaries(quiz_id, context):
    # Move imports INSIDE function to avoid circular import
    print(f"generating summary")

    with context:
        print(f"found context")

        quiz = db.session.get(Quiz, quiz_id)
        generated_summary = generate_video_summary_prompt(quiz.video_url)
        print(f"generated summary: {generated_summary}")
        gen_quiz_json = generate_video_quiz_prompt(generated_summary)
        print(f"generated quiz: {gen_quiz_json}")

        quiz.summary = generated_summary
        quiz.quiz_json = gen_quiz_json

        db.session.add(quiz)
        db.session.commit()



