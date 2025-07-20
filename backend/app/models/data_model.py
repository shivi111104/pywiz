class Accuracy:
    def __init__(self, level_number, difficulty, correct_questions, total_questions, accuracy):
        self.level_number = level_number
        self.difficulty = difficulty
        self.correct_questions = correct_questions
        self.total_questions = total_questions
        self.accuracy = accuracy

    def save_to_db(self):
        from main import mongo
        accuracy_collection = mongo.db.accuracy
        accuracy_data = []
      # accuracy_collection.insert_many(accuracy_data)
