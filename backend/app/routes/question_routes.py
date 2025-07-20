from flask import Blueprint, request, jsonify
from app.models.question_model import Question
question_routes = Blueprint('question_routes', __name__)

@question_routes.route('/questions/add', methods=['POST'])
def add_question():
    data = request.get_json()
    level_number = data.get('levelNumber')
    question_text = data.get('question')
    output = data.get('output')
    difficulty = data.get('difficulty')
    partial_answer = data.get('partialAnswer')
    correct_answer = data.get('correctAnswer')
    question = Question(level_number=level_number, question=question_text, output=output,
                        difficulty=difficulty, partial_answer=partial_answer, correct_answer=correct_answer)
    question.save_to_db()
    return jsonify({'message': 'Question added successfully'}), 201

@question_routes.route('/questions/all', methods=['GET'])
def get_all_questions():
    from main import mongo
    questions_collection = mongo.db.questions
    questions_data = list(questions_collection.find({}, {'_id': 0}))
    return jsonify(questions_data), 200

@question_routes.route('/questions/delete/<question_text>', methods=['DELETE'])
def delete_question(question_text):
    from main import mongo
    questions_collection = mongo.db.questions
    result = questions_collection.delete_one({'question': question_text})

    if result.deleted_count == 1:
        return jsonify({'message': 'Question deleted successfully'}), 200
    else:
        return jsonify({'error': 'Question not found'}), 404