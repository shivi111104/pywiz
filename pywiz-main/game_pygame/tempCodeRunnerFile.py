import pygame
import pymongo
from sys import exit

cluster_url = "mongodb+srv://rachit:pyWizAdmin435@maindb.c6aaec6.mongodb.net/"
client = pymongo.MongoClient(cluster_url)
db = client["pywiz"]  
user_collection = db["users"]
accuracy_collection = db["accuracy"]
question_collection = db["questions"]

username_text = ""
password_text = ''

def find_by_email(email):
    users_collection = db["users"]
    user_data = users_collection.find_one({'email': email}, {'_id': 0})
    if user_data:
        return user_data
    return None


start_time = 0
current_score = 0
class NextLevel_screen:
     
        def __init__(self, accuracy, levels_completed, score,font):
                font = pygame.font.SysFont('VT323-Regular.ttf', 30)
                self.accuracy_txt = font.render(f'{accuracy}', True, (255, 255, 255))
                self.levels_completed_txt = font.render(f'{levels_completed}', True, (255, 255, 255))
                self.score_txt = font.render(f'{score}', True, (255, 255, 255))



def display_score(font,start_time,screen,screen_width,screen_height):
    current_time = int(pygame.time.get_ticks()/1000)-start_time
    score_surf = font.render(f'{current_time}',False,"white")
    score_x = screen_width - 20
    score_y = 20
    score_rect = score_surf.get_rect(center = (score_x,score_y))
    pygame.draw.circle(screen, "grey", (score_x,score_y), 20)
    screen.blit(score_surf,score_rect) 



def load_images_ques1(screen_size):
    scene1_surface = pygame.image.load('graphics/backgrounds/scene1.jpg').convert()
    dialogue_box = pygame.image.load('graphics/backgrounds/dialougeBox.png').convert_alpha()
    dragon_surface = pygame.image.load('graphics/dragons/dragon1-resized.png').convert_alpha()
    player1_surf = pygame.image.load('graphics/players/p1_resized.png').convert_alpha()
    dragon_fire3 = pygame.image.load("graphics/lives/fire3.png").convert_alpha()
    dragon_fire2 = pygame.image.load("graphics/lives/fire2.png").convert_alpha()
    dragon_fire1 = pygame.image.load("graphics/lives/fire1.png").convert_alpha()
    dragon_fire0 = pygame.image.load("graphics/lives/fire0.png").convert_alpha()
    player_lives3 = pygame.image.load("graphics/lives/heart3.png").convert_alpha()
    player_lives2 = pygame.image.load("graphics/lives/heart2.png").convert_alpha()
    player_lives1 = pygame.image.load("graphics/lives/heart1.png").convert_alpha()
    player_lives0 = pygame.image.load("graphics/lives/heart0.png").convert_alpha()
    level_bar0 = pygame.image.load("graphics/lives/level0.png").convert_alpha()
    level_bar1 = pygame.image.load("graphics/lives/level1.png").convert_alpha()
    level_bar2 = pygame.image.load("graphics/lives/level2.png").convert_alpha()
    level_bar3 = pygame.image.load("graphics/lives/level3.png").convert_alpha()
    
    scene1_surface = pygame.transform.scale(scene1_surface, screen_size)
    
    return scene1_surface, dialogue_box, dragon_surface, player1_surf, dragon_fire3, dragon_fire2, dragon_fire1, dragon_fire0, player_lives3, player_lives2, player_lives1, player_lives0, level_bar0, level_bar1, level_bar2, level_bar3

def render_text(surface, text, font, color, rect):
    words = text.split(' ')
    lines = []
    line = ''
    max_width, max_height = rect.size

    for word in words:
        test_line = line + word + ' '
        test_text = font.render(test_line, True, color)
        if test_text.get_width() <= max_width:
            line = test_line
        else:
            lines.append(line)
            line = word + ' '
    lines.append(line)

    y = rect.top
    for line in lines:
        text_surface = font.render(line, True, color)
        surface.blit(text_surface, (rect.left, y))
        y += text_surface.get_height()


def check_input(answer,counter, event, input_active, user_input, input_box, submit_button, correct_answer,
                game_active, start_time,player_life,dragon_life,screen_height, screen_width,score_factor, accuracy_total_solved,accuracy_total_correct, levelno):
    global current_score
    if event.type == pygame.KEYDOWN:
        if event.key == pygame.K_BACKSPACE:
            user_input = user_input[:-1]
        elif event.key == pygame.K_RETURN:
            input_active = not input_active
        else:
            if input_active:
                user_input += event.unicode
    input_box_x = 5
    input_box_y = screen_height - 85
    input_box = pygame.Rect(input_box_x, input_box_y, 320, 80)
    submit_button = pygame.Rect(245, screen_height - 37, 80, 32)
    if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
        if input_box.collidepoint(event.pos):
            input_active = not input_active
        else:
            input_active = False
        if submit_button.collidepoint(event.pos):
            accuracy_total_solved += 1

            if user_input == correct_answer:
                accuracy_collection.update_one({'level_number': levelno, 'difficulty': difficulty}, {
                    "$set": {'total_questions': accuracy_total_solved, 'correct_questions': accuracy_total_correct + 1,
                             'accuracy': ((accuracy_total_correct + 1) / accuracy_total_solved) * 100}})
                print("Congratulations! You guessed correctly!")
                start_time = int(pygame.time.get_ticks()/1000)
                answer = True
                game_active =  True
                current_score += 6 * score_factor
                counter += 1
                if dragon_life > 0:
                    dragon_life -= 1

            else:
                accuracy_collection.update_one({'level_number': levelno, 'difficulty': difficulty}, {
                    "$set": {'total_questions': accuracy_total_solved, 'correct_questions': accuracy_total_correct,
                             'accuracy': (accuracy_total_correct / accuracy_total_solved) * 100}})
                print("Sorry, wrong guess. Try again!")
                answer = False
                if player_life > 0:
                    player_life -= 1
                if player_life == 0:
                    game_active = False
            user_input = ''

    return input_active, user_input, game_active,start_time, player_life, dragon_life, counter, answer,current_score,accuracy_total_solved


def draw_elements(hint_surface, partialAns_surf, font_level, levelno, input_active, counter, screen, scene1_surface, dialogue_box, question_surface, dragon_surface, player1_surf,
                  dragon_fire3, dragon_fire2, dragon_fire1, dragon_fire0, player_lives3, player_lives2, player_lives1, player_lives0, level_bar0, level_bar1, level_bar2, level_bar3, input_box, submit_button, font, user_input,dragon_life, player_life, screen_width, screen_height):
    screen.blit(scene1_surface, (0, 0))
    dialogue_box_width= 400
    dialogue_box_x = screen_width - dialogue_box_width
    dialogue_box_y = 10
    dialogue_box_rect = dialogue_box.get_rect(topleft=(dialogue_box_x,dialogue_box_y))
    screen.blit(dialogue_box, dialogue_box_rect)
    ques_surf_width = 370
    ques_surf_x = screen_width - ques_surf_width
    ques_surf_y = 60
    ques_surf_rect = question_surface.get_rect(topleft = (ques_surf_x,ques_surf_y))
    hint_surface_rect = hint_surface.get_rect(topleft = (screen_width-305,screen_height-85))
    screen.blit(hint_surface,hint_surface_rect)
    # pygame.draw.rect(screen,(0,0,255),hint_surface_rect,1)
    partialAns_surf_rect = partialAns_surf.get_rect(topleft = (screen_width//2-100,screen_height-85))
    screen.blit(partialAns_surf,partialAns_surf_rect)
    # pygame.draw.rect(screen,(0,0,255),partialAns_surf_rect,1)
    screen.blit(question_surface, ques_surf_rect)
    dragon_width = screen_width//2 + 120
    dragon_height = screen_height//2 + 70
    dragon_x = dragon_width
    dragon_y = dragon_height
    dragon_rect = dragon_surface.get_rect(bottomright=(dragon_x, dragon_y))
    screen.blit(dragon_surface, dragon_rect)
    dragon_fire3_rect = dragon_fire3.get_rect(bottomright=(dragon_x - 70,(dragon_height-230)))
    if dragon_life == 3:
        screen.blit(dragon_fire3, dragon_fire3_rect)
    elif dragon_life == 2:
        screen.blit(dragon_fire2, dragon_fire3_rect)
    elif dragon_life == 1:
        screen.blit(dragon_fire1, dragon_fire3_rect)
    else:
        screen.blit(dragon_fire0, dragon_fire3_rect)
    player_width = screen_width//4 - 70
    player_height = 2*screen_height//3 - 40
    player1_rect = player1_surf.get_rect(midbottom=(player_width,player_height))
    screen.blit(player1_surf, player1_rect)
    player_lives3_rect = player_lives3.get_rect(midbottom=(player_width,player_height-120))
    level_bar_x = screen_width//2
    level_bar_y = 5
    level_bar_rect = level_bar0.get_rect(midtop = (level_bar_x,level_bar_y))
    if player_life == 3:
        screen.blit(player_lives3, player_lives3_rect)
    elif player_life == 2:
        screen.blit(player_lives2, player_lives3_rect)
    elif player_life == 1:
        screen.blit(player_lives1, player_lives3_rect)
    else:
        screen.blit(player_lives0, player_lives3_rect)

    if counter == 0:
        screen.blit(level_bar0, level_bar_rect)
    elif counter == 1:
        screen.blit(level_bar1, level_bar_rect)
    elif counter == 2:
        screen.blit(level_bar2, level_bar_rect)
    elif counter == 3:
        screen.blit(level_bar3, level_bar_rect)
    input_box_x = 5
    input_box_y = screen_height - 85
    input_box = pygame.Rect(input_box_x, input_box_y, 320, 80)
    pygame.draw.rect(screen, ('#c0e8ec'), input_box)
    transparent_surface = pygame.Surface((input_box.width, input_box.height), pygame.SRCALPHA)
    transparent_surface.fill('#c0e8ec')
    submit_box_x = 245
    submit_box_y = screen_height - 37
    submit_button = pygame.Rect(submit_box_x, submit_box_y, 80, 32)
    pygame.draw.rect(screen, (0, 0, 150), submit_button, border_radius=2)
    enter_text = "[Left click/Press enter key to answer]"
    enter_text_surf = font.render(enter_text,True,(64,64,64))
    submit_text = "[Click on Submit button to submit]"
    submit_text_surf = font.render(submit_text,True,(64,64,64))
    if input_active == False:
        screen.blit(enter_text_surf, (input_box_x, input_box_y))
        screen.blit(submit_text_surf, (input_box_x, input_box_y+20))

    levNo = font_level.render(f'{levelno}',False,(64,64,64))
    screen.blit(levNo,(level_bar_x+32,level_bar_y+13))
    # input_box_x = 10
    # input_box_y = screen_height - 5
    text_surface = font.render(user_input, True, (0, 0, 0))
    screen.blit(text_surface, (input_box.x + 5, input_box.y + 5))

    submit_text = font.render("Submit", True, (255, 255, 255))
    screen.blit(submit_text, (submit_button.x + 10, submit_button.y + 10))


def main(username_text):
    global start_time, common_var, accuracy, levels_completed, score, difficulty, correct
    pygame.init()
    screen_width = 1024
    screen_height = 576
    screen = pygame.display.set_mode((screen_width, screen_height), pygame.RESIZABLE)
    screen2 = pygame.display.set_mode((screen_width, screen_height), pygame.RESIZABLE)
    pygame.display.set_caption('WizzPy')
    clock = pygame.time.Clock()
    font = pygame.font.SysFont('fonts/Pixeltype.ttf', 24)
    font_level = pygame.font.SysFont('fonts/Pixeltype.ttf', 23, True)
    font_timer = pygame.font.SysFont('fonts/Pixeltype.ttf', 40)
    font_large = pygame.font.SysFont('fonts/Pixeltype.ttf', 64)
    levelno = 1
    (scene1_surface, dialogue_box, dragon_surface, player1_surf, dragon_fire3, dragon_fire2,
     dragon_fire1, dragon_fire0, player_lives3, player_lives2, player_lives1, player_lives0,
     level_bar0, level_bar1, level_bar2, level_bar3)= load_images_ques1(screen.get_size())
   
    game_active = True
    answer = False
    start_time = 0
    counter = 0 
    dragon_life = 3
    player_life = 3

    print(username_text)

    input_box_x = 5
    input_box_y = screen_height - 85
    input_box = pygame.Rect(input_box_x, input_box_y, 320, 80)
    # partialAns = pygame.Rect(input_box_x, input_box_y, 320, 80)
    submit_button = pygame.Rect(240, 544, 80, 32)
    input_active = False
    user_input = ''



    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                exit()
            question_surface = pygame.Surface((300, 100))
            hint_surface = pygame.Surface((300, 80))
            partialAns_surface = pygame.Surface((300, 80))
            partialAns_surface.fill("#ccff90")
            hint_surface.fill("#ffccbc")
            question_surface.fill("white")
            Level_question = question_collection.find({"levelNumber": levelno})
            long_text = Level_question[3-dragon_life].get("question")
            partialAns = Level_question[3-dragon_life].get("partialAnswer")
            difficulty = Level_question[3-dragon_life].get("difficulty")
            score_factor = 2

            if difficulty == "Easy":
                score_factor = 1
            elif difficulty == "Medium":
                score_factor = 1.5

            expected_output = Level_question[3-dragon_life].get("output")
            partialAns = "Partial Filled Ans:  " + partialAns
            expected_output = "Expected Output:  " + expected_output
            correct_answer = Level_question[3-dragon_life].get("correctAnswer")

            result = accuracy_collection.find_one({'level_number': levelno, 'difficulty': difficulty})
            accuracy_total_solved = result.get("total_questions") if result else None
            accuracy_total_correct = result.get("correct_questions")

            common_var = find_by_email(username_text)
            accuracy = common_var.get("accuracy")
            levels_completed = common_var.get("max_level")
            score = common_var.get("score")
            total_solved = common_var.get("total_solved")

            render_text(question_surface, long_text, font, (0, 0, 0), question_surface.get_rect())
            render_text(hint_surface,expected_output, font, (0, 0, 0), hint_surface.get_rect())
            render_text(partialAns_surface,partialAns, font, (0, 0, 0), partialAns_surface.get_rect())
            input_active, user_input, game_active, start_time, player_life, dragon_life, counter, answer, current_score, accuracy_total_solved = check_input(answer, counter, event, input_active, user_input, input_box, submit_button,
                                                   correct_answer, game_active, start_time, player_life, dragon_life, screen_height, screen_width, score_factor, accuracy_total_solved, accuracy_total_correct, levelno)
            
            if event.type == pygame.VIDEORESIZE:
                screen = pygame.display.set_mode((event.w, event.h), pygame.RESIZABLE)
                scene1_surface, dialogue_box, dragon_surface, player1_surf, dragon_fire3, dragon_fire2, dragon_fire1, \
                dragon_fire0, player_lives3, player_lives2, player_lives1, player_lives0, level_bar0, level_bar1, level_bar2, level_bar3= load_images_ques1(screen.get_size())
                screen_width, screen_height = event.w, event.h
        level_bar_x = screen_width//2
        level_bar_y = 5
        level_bar_rect = level_bar0.get_rect(midtop=(level_bar_x, level_bar_y))
        if game_active:
            draw_elements(hint_surface, partialAns_surface,font_level,levelno,input_active,counter, screen, scene1_surface, dialogue_box, question_surface, dragon_surface, player1_surf,
                      dragon_fire3, dragon_fire2, dragon_fire1, dragon_fire0, player_lives3, player_lives2, player_lives1, player_lives0, level_bar0, level_bar1, level_bar2, level_bar3, input_box, submit_button, font, user_input, dragon_life, player_life, screen_width, screen_height)

            if common_var:
                accuracy = common_var.get("accuracy", "N/A")
                levels_completed = common_var.get("max_level", "N/A")
                score = common_var.get("score", "N/A")
                correct = common_var.get('correct', "N/A")
                next_level_screen = NextLevel_screen(f'Accuracy: {accuracy}', f'Levels Passed: {levels_completed}', f'Score: {score}', font)

            if counter == 3:  # Player answered all three questions correctly
                screen.blit(level_bar3, level_bar_rect)  # Blit level_bar3_surf
                levNo = font_level.render(f'{levelno}',False,(64, 64, 64))
                screen.blit(levNo,(level_bar_x+32,level_bar_y+13))
                pygame.display.update()  # Update display to show level_bar3
                pygame.time.delay(2000)  # Delay for 2 seconds (adjust as needed)
                answer = False
                start_time = pygame.time.get_ticks()
               
                pygame.display.update()

                start_ticks = pygame.time.get_ticks() 
                duration = 6000
                while True:
                    current_ticks = pygame.time.get_ticks()
                    elapsed_time = current_ticks - start_ticks
                    remaining_time = duration - elapsed_time
                    if remaining_time >= 0:
                        seconds = int(remaining_time / 1000)  # Convert milliseconds to seconds
                        countdown_text = font_large.render(f'{seconds}', True, "#FFDB58")
                        screen2.fill((21, 5, 6))  # Clear screen2
                        success = "Congratulations!"
                        nextLevel = f"Level {levelno+1} Starting in"
                        success_surf = font_large.render(success, False, "#FFDB58")
                        nextLevel_surf = font_large.render(nextLevel, False, "#FFDB58")
                        # screen2.fill("white")
                        exitButton = pygame.image.load('graphics/buttons/exit.png').convert_alpha()
                        exitButton_rect = exitButton.get_rect(bottomright=(screen_width//2+110,screen_height//2+150))
                        screen2.blit(exitButton,exitButton_rect)
                        for event in pygame.event.get():  # Event handling within the countdown screen
                            if event.type == pygame.QUIT:
                                pygame.quit()
                                exit()
                            if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                                if exitButton_rect.collidepoint(event.pos):
                                    pygame.quit()
                                    exit()
                        success_rect = success_surf.get_rect(bottomright=(screen_width//2+200,screen_height//2-200))
                        nextLevel_rect = nextLevel_surf.get_rect(bottomright=(screen_width//2+210,screen_height//2-120))
                        screen2.blit(success_surf,success_rect)
                        screen2.blit(nextLevel_surf,nextLevel_rect)
                        screen2.blit(countdown_text,(screen_width//2,screen_height//2-50))
                        
                        pygame.display.update()
                    if remaining_time <= 0:
                        pygame.time.delay(500)
                        break
                total_solved += 6 - player_life - dragon_life

                user_collection.update_one({"email": username_text},{'$set': {'total_solved': total_solved}})
                user_collection.update_one({"email": username_text},{
                    '$set': {'accuracy': ((correct + 3)/total_solved)*100,
                            'score': score + current_score, 'correct': correct +3}})
                print(username_text, total_solved)
                # pygame.display.update()  # Update display to show level_bar3
                # pygame.time.delay(5000)  # Delay for 2 seconds (adjust as needed)
                levelno += 1  # Increase the level number
                # Reset game state
                counter = 0
                game_active = True
                start_time = 0
                player_life = 3
                dragon_life = 3

                level_bar3 = level_bar3.copy()  # Reset level_bar3_surf to original state
                continue  # Skip the rest of the loop to restart the game state
        else:
            # pygame.quit()
            # exit()
            exitButton = pygame.image.load('graphics/buttons/exit.png').convert_alpha()
            gameover = pygame.image.load('graphics/buttons/gameover.jpg').convert_alpha()
            tryagain = pygame.image.load('graphics/buttons/tryagain_resized.png').convert_alpha()
            screen2.fill((21,5,6))
            gameover_rect = gameover.get_rect(bottomright=(screen_width//2+150,screen_height//2+50))
            exitButton_rect = exitButton.get_rect(bottomright=(screen_width//2-50,screen_height//2+150))
            tryagain_rect = tryagain.get_rect(bottomright=(screen_width//2+300,screen_height//2+155))
            screen2.blit(gameover,gameover_rect)
            screen2.blit(exitButton,exitButton_rect)
            screen2.blit(tryagain,tryagain_rect)
            accuracy_rect = next_level_screen.accuracy_txt.get_rect(left=40, top=500)
            max_level_rect = next_level_screen.levels_completed_txt.get_rect(left=40, top=accuracy_rect.bottom )
            score_rect = next_level_screen.score_txt.get_rect(left=40, top=max_level_rect.top + 20)
            screen2.blit(next_level_screen.accuracy_txt, accuracy_rect)
            screen2.blit(next_level_screen.levels_completed_txt, max_level_rect )
            screen2.blit(next_level_screen.score_txt, score_rect)
            if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                if exitButton_rect.collidepoint(event.pos):
                    pygame.quit()
                    exit()
                if tryagain_rect.collidepoint(event.pos):
                    levelno = 1
                    counter = 0
                    game_active = True
                    start_time = 0
                    player_life = 3
                    dragon_life = 3
                    continue  # Skip the rest of the loop to restart the game state
            #display_score(font_timer,start_time,screen,screen_width,screen_height)
        pygame.display.update()
        clock.tick(60) 

if __name__ == "__main__":
    main()