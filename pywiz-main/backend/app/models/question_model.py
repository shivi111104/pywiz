class Question:
    def __init__(self, level_number, question, output, difficulty, partial_answer, correct_answer):
        self.level_number = level_number
        self.question = question
        self.output = output
        self.difficulty = difficulty
        self.partial_answer = partial_answer
        self.correct_answer = correct_answer

    def save_to_db(self):
        from main import mongo
        questions_collection = mongo.db.questions
        questions_collection.insert_one({
            'levelNumber': self.level_number,
            'question': self.question,
            'output': self.output,
            'difficulty': self.difficulty,
            'partialAnswer': self.partial_answer,
            'correctAnswer': self.correct_answer
        })
