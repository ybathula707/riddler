from flask import Blueprint, request, jsonify
from .models.quiz import db, Quiz

quiz_bp = Blueprint('quiz', __name__)


@quiz_bp.route('/quiz', methods=['POST'])
def create_quiz():
    """
    Create a new quiz record
    
    Request body:
    {
        "videoUrl": "https://youtube.com/watch?v=example"
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate required fields
        if not data:
            return jsonify({'error': 'Request body is required'}), 400
        
        video_url = data.get('videoUrl')
        
        if not video_url:
            return jsonify({'error': 'videoUrl is required'}), 400
    
        
        # Create new quiz record
        new_quiz = Quiz(
            video_url=video_url,
            summary=""
        )
        
        # Save to database
        db.session.add(new_quiz)
        db.session.commit()
        
        # Return created quiz
        return jsonify({
            'message': 'Quiz created successfully',
            'quiz': new_quiz.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create quiz: {str(e)}'}), 500


@quiz_bp.route('/quiz/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    """Get a specific quiz by ID"""
    try:
        quiz = Quiz.query.get(quiz_id)
        if not quiz:
            return jsonify({'error': 'Quiz not found'}), 404
        
        return jsonify({
            'quiz': quiz.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch quiz: {str(e)}'}), 500
