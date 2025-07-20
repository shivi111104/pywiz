from app.models.data_model import Accuracy

class User:
    def __init__(self, prn, username, email, password, panel_num, role='user', total_solved=0, correct=0,
                 incorrect=0, accuracy=0, score=0, max_level=1,verification_token=None, verified=False,
                 achievements=None):
        self.prn = prn
        self.username = username
        self.email = email
        self.password = password
        self.panel_num = panel_num
        self.total_solved = total_solved
        self.correct = correct
        self.incorrect = incorrect
        self.accuracy = accuracy
        self.score = score
        self.max_level = max_level
        self.role = role
        self.verification_token = verification_token
        self.verified = verified
        self.achievements = achievements if achievements is not None else []
        self.add_sample_achievements()

    def add_achievement(self, achievement):
        self.achievements.append(achievement)

    def add_sample_achievements(self):
        sample_achievements = [
            {
                "name": "Python Novice",
                "description": "Slain 5+ enemies",
                "condition": "correct >= 5",
                "reward": 10,
                "unlocked": False,
                "icon_url": "https://example.com/icons/python_novice.png",
                "unlocked_date": None
            },
            {
                "name": "Python Enthusiast",
                "description": "Slain 20+ enemies",
                "condition": "correct >= 20",
                "reward": 50,
                "unlocked": False,
                "icon_url": "https://example.com/icons/python_enthusiast.png",
                "unlocked_date": None
            },
            {
                "name": "Python Master",
                "description": "Slain 50+ enemies",
                "condition": "correct >= 50",
                "reward": 100,
                "unlocked": False,
                "icon_url": "https://example.com/icons/python_master.png",
                "unlocked_date": None
            },
            {
                "name": "Master Scorer",
                "description": "Attain more than 100 points",
                "condition": "score >= 100",
                "reward": 100,
                "unlocked": False,
                "icon_url": "https://example.com/icons/python_master.png",
                "unlocked_date": None
            },
            {
                "name": "Score Knight",
                "description": "Attain more than 200 points",
                "condition": "score >= 200",
                "reward": 100,
                "unlocked": False,
                "icon_url": "https://example.com/icons/python_master.png",
                "unlocked_date": None
            },
            {
                "name": "Score Demon",
                "description": "Attain more than 300 points",
                "condition": "score >= 300",
                "reward": 100,
                "unlocked": False,
                "icon_url": "https://example.com/icons/python_master.png",
                "unlocked_date": None
            },
        ]

        for ach in sample_achievements:
            self.add_achievement(ach)

    def save_to_db(self):
        from main import mongo
        users_collection = mongo.db.users

        users_collection.insert_one({
            'prn': self.prn,
            'username': self.username,
            'email': self.email,
            'password': self.password,
            'panel_num': self.panel_num,
            'total_solved': self.total_solved,
            'correct': self.correct,
            'incorrect': self.incorrect,
            'accuracy': self.accuracy,
            'score': self.score,
            'max_level': self.max_level,
            'role': self.role,
            'verification_token': self.verification_token,
            'verified': self.verified,
            'achievements': self.achievements

        })

    @staticmethod
    def find_by_prn(prn):
        from main import mongo
        users_collection = mongo.db.users
        user_data = users_collection.find_one({'prn': prn}, {'_id': 0})
        if user_data:
            return User(**user_data)
        return None

    @staticmethod
    def find_by_username(username):
        from main import mongo
        users_collection = mongo.db.users
        user_data = users_collection.find_one({'username': username}, {'_id': 0})
        if user_data:
            return User(**user_data)
        return None

    @staticmethod
    def find_by_email(email):
        from main import mongo
        users_collection = mongo.db.users
        user_data = users_collection.find_one({'email': email}, {'_id': 0})
        if user_data:
            return User(**user_data)
        return None

    @staticmethod
    def find_all():
        from main import mongo
        users_collection = mongo.db.users
        all_users = users_collection.find({}, {'_id': 0})
        return [User(**user_data) for user_data in all_users]

    @staticmethod
    def update_user_data(self, total_solved, correct, incorrect, score):
        self.total_solved += total_solved
        self.correct += correct
        self.incorrect += incorrect
        self.score += score
        self.accuracy = self.correct / (self.correct + self.incorrect) if self.correct + self.incorrect > 0 else 0
        from main import mongo

        users_collection = mongo.db.users
        users_collection.update_one(
            {'prn': self.prn},
            {'$set': {
                'total_solved': self.total_solved,
                'correct': self.correct,
                'incorrect': self.incorrect,
                'accuracy': self.accuracy,
                'score': self.score
            }}
        )

    @staticmethod
    def update_verification_status(prn, verified):
        from main import mongo
        users_collection = mongo.db.users
        users_collection.update_one({'prn': prn}, {'$set': {'verified': verified}})
