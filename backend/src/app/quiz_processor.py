
from .gemini_client import generate_video_quiz_prompt
from .models.quiz import Quiz, db

def create_quiz(quiz_id, context):
    # Move imports INSIDE function to avoid circular import
    print(f"generating quiz")

    with context:
        print(f"found context")

        quiz = db.session.get(Quiz, quiz_id)
        gen_quiz_json = generate_video_quiz_prompt(quiz.summary)
        print(f"quiz json: {gen_quiz_json}")
        quiz.quiz_json = gen_quiz_json
        db.session.add(quiz)
        db.session.commit()
        


