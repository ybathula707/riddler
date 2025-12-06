from flask import Blueprint, request, jsonify
from .models.quiz import db, Quiz
import json

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
    
        # comment out after quiz agent implemented
        default_quiz_json = json.dumps({
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
                },
                {
                    "id": "7e2f9c1b-5d8a-4e3c-b6f7-2a9c8d4e6f1b",
                    "content": "Madrid"
                }
                ],
                "correct_answers": ["da8b428c-8b35-445f-9fbf-e02eb23fb0f8"]
            },
            {
                "id": "8f3c2b1a-9d7e-4c5f-a2b6-1e8d9c3f7a2b",
                "content": "What is 2 + 2?",
                "answers": [
                {
                    "id": "1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d",
                    "content": "3"
                },
                {
                    "id": "2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
                    "content": "4"
                },
                {
                    "id": "3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f",
                    "content": "5"
                }
                ],
                "correct_answers": ["2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e"]
            }
            ]
        })
        
        # Create new quiz record
        new_quiz = Quiz(
            video_url=video_url,
            # quiz_json=default_quiz_json, # TODO: remove this
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
