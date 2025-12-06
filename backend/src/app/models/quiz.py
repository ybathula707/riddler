from datetime import datetime
from sqlalchemy import event
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Quiz(db.Model):
    """Quiz model representing the quiz table in MySQL database"""
    
    __tablename__ = 'quiz'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    video_url = db.Column(db.String(2048), nullable=False)
    summary = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f'<Quiz {self.id}>'
    
    def to_dict(self):
        """Convert Quiz object to dictionary"""
        return {
            'id': self.id,
            'video_url': self.video_url,
            'summary': self.summary,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

@event.listens_for(Quiz, 'after_insert')
def receive_after_insert(mapper, connection, target):
    from ..video_processor import generate_summaries
    from src.app import app_context
    import threading

    print(f"SQLAlchemy after_insert event: User {target.video_url} created.")
    thread = threading.Thread(target=generate_summaries,args=(target.id, app_context),daemon=True )
    thread.start()
    #video_summary = generate_summaries(target.video_url)
    # Quiz(summary = summary)
    # Quiz.save()

    # quizJson = QuizGenerator.generateQuizJson()
    # Quiz(quizJson = quizJson)
    # Quiz.save()