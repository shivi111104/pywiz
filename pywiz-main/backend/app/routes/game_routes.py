from flask import Blueprint, request, jsonify
from app.models.user import User

game_routes = Blueprint('game_routes', __name__)


@game_routes.route('/auth/findall', methods=['GET'])
def find_all_users():
    all_users = User.find_all()
    if all_users:
        users_data = [
            {'prn': user.prn, 'username': user.username, 'total_solved': user.total_solved, 'correct': user.correct,
             'incorrect': user.incorrect, 'accuracy': user.accuracy, 'score': user.score,
             'max_level': user.max_level} for user in all_users]
        return jsonify(users_data), 200
    else:
        return jsonify({'message': 'No users found'}), 404


@game_routes.route('/auth/updateScore', methods=['PUT'])
def update_user():
    data = request.get_json()
    prn = data.get('prn')
    total_solved = data.get('total_solved')
    correct = data.get('correct')
    incorrect = data.get('incorrect')
    score= data.get('score')
    user = User.find_by_prn(prn)
    if user:
        user.update_user_data(total_solved, correct, incorrect,score)
        return jsonify({'message': 'User data updated successfully'}), 200
    else:
        return jsonify({'error': 'User not found'}), 404


@game_routes.route('/getUserStats', methods=['POST'])
def get_user_stats_by_email():
    email = request.json.get('email')
    if not email:
        return jsonify({'error': 'Email not provided in the request body'}), 400
    user = User.find_by_email(email)
    print(user)
    print(email)
    if not user:
        return jsonify({'error': 'User not found for the provided email'}), 404

    user_stats = {
        'username': user.username,
        'total_solved': user.total_solved,
        'correct': user.correct,
        'incorrect': user.total_solved - user.correct,
        'accuracy': user.accuracy,
        'score': user.score,
        'max_level': user.max_level
    }

    return jsonify(user_stats), 200


@game_routes.route('/getUserAchievements', methods=['POST'])
def get_user_achievements_by_email():
    email = request.json.get('email')
    if not email:
        return jsonify({'error': 'Email not provided in the request body'}), 400

    user = User.find_by_email(email)
    if not user:
        return jsonify({'error': 'User not found for the provided email'}), 404

    user_achievements = user.achievements

    return jsonify({'achievements': user_achievements}), 200

@game_routes.route('/api/getLevelData', methods=['GET'])
def get_level_data():
    from main import mongo
    accuracy_collection = mongo.db.accuracy
    all_accuracy_data = accuracy_collection.find()
    level_accuracy_data = {}

    for data in all_accuracy_data :
        if data.get("total_questions") > 0:
            level_number = data['level_number']
            accuracy = data['accuracy']

            if level_number not in level_accuracy_data:
                level_accuracy_data[level_number] = {'total_accuracy': accuracy, 'count': 1}
            else:
                level_accuracy_data[level_number]['total_accuracy'] += accuracy
                level_accuracy_data[level_number]['count'] += 1

    average_accuracy_data = [{'level_number': level, 'average_accuracy': data['total_accuracy'] / data['count']}
                             for level, data in level_accuracy_data.items()]

    return jsonify(average_accuracy_data)


@game_routes.route('/getDifficultyData', methods=['GET'])
def get_difficulty_data():
    from main import mongo
    accuracy_collection = mongo.db.accuracy
    all_accuracy_data = accuracy_collection.find()
    difficulty_accuracy_data = {}

    for data in all_accuracy_data:
        if data.get("total_questions") > 0:
            difficulty = data['difficulty']
            accuracy = data['accuracy']

            if difficulty not in difficulty_accuracy_data:
                difficulty_accuracy_data[difficulty] = {'total_accuracy': accuracy, 'count': 1}
            else:
                difficulty_accuracy_data[difficulty]['total_accuracy'] += accuracy
                difficulty_accuracy_data[difficulty]['count'] += 1

    average_accuracy_data = [{'difficulty': diff, 'average_accuracy': data['total_accuracy'] / data['count']}
                             for diff, data in difficulty_accuracy_data.items()]

    sorted_average_accuracy_data = sorted(average_accuracy_data, key=lambda x: x['difficulty'])

    return jsonify(sorted_average_accuracy_data)

@game_routes.route('/api/userCount', methods=['GET'])
def get_user_count():
    all_users = User.find_all()

    users = [user for user in all_users if user.total_solved > 0]

    if not users:
        return jsonify({'user_count': 0, 'average_accuracy': 0, 'average_score': 0}), 200

    user_count = len(users)
    total_accuracy = sum(user.accuracy for user in users)
    total_score = sum(user.score for user in users)

    average_accuracy = total_accuracy / user_count
    average_score = total_score / user_count

    return jsonify(
        {'user_count': user_count, 'average_accuracy': average_accuracy, 'average_score': average_score}), 200
