import pymongo
import pygame
import tempCodeRunnerFile
import pygame.locals as pl

pygame.init()

login = False
def display_main_game_screen():
    start_ticks = pygame.time.get_ticks() 
    duration = 6000
    running = True
    while running:
        current_ticks = pygame.time.get_ticks()
        elapsed_time = current_ticks - start_ticks
        remaining_time = duration - elapsed_time
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
        seconds = int(remaining_time / 1000)  # Convert milliseconds to seconds
        countdown_text = font.render(f'{seconds}', True, "#770737")
        screen.fill("#C3B1E1")
        success_msg = font.render("Sign in successful!",True,"#770737")
        game_start_msg = font.render("Game starting in-",True,"#770737")
        success_msg_rect = success_msg.get_rect(topleft = (screen_width//2-100,screen_height//2-50))
        game_start_msg_rect = game_start_msg.get_rect(topleft = (screen_width//2-90,screen_height//2))
        screen.blit(success_msg,success_msg_rect)   
        screen.blit(game_start_msg,game_start_msg_rect)
        screen.blit(countdown_text,(screen_width//2,screen_height//2+50))
        pygame.display.update()
        pygame.display.flip()
        if remaining_time <= 0:
            pygame.time.delay(500) 
            return # Delay for 2 seconds (optional)
            # login = True
            # # break

            # pygame.time.delay(500)  # Delay for 2 seconds (optional)
            # pygame.quit()
            # exit()

cluster_url = "mongodb+srv://rachit:pyWizAdmin435@maindb.c6aaec6.mongodb.net/"
client = pymongo.MongoClient(cluster_url)
db = client["pywiz"]  
user_collection = db["users"]

# Screen setup
screen_width, screen_height = 640, 480
screen = pygame.display.set_mode((screen_width, screen_height), pygame.RESIZABLE)

# Load background image
background_image = pygame.image.load('img2.webp')  # Replace 'background_image.png' with your image file

# Colors
BLACK = (0, 0, 0)
WHITE = (255, 255, 255, 100)  # Adjust the alpha value to control transparency
color_inactive = pygame.Color('lightskyblue3')
color_active = pygame.Color('dodgerblue2')
highlight_color = pygame.Color('yellow')  # Highlight color when input box is active

# Font setup
font_path = "VT323-Regular.ttf"
font_size = 25
font = pygame.font.Font(font_path, font_size)

# Text input setup
text_email = ""
text_password = ""
active_email = False
active_password = False
input_box_width = 200
input_box_height = font_size
input_box_email = pygame.Rect((screen_width - input_box_width) // 2, (screen_height - input_box_height) // 2 - 50, input_box_width, input_box_height)
input_box_password = pygame.Rect((screen_width - input_box_width) // 2, (screen_height - input_box_height) // 2 + 50, input_box_width, input_box_height)
color_email = color_inactive
color_password = color_inactive

# Calculate the dimensions of the box covering all text and the sign-in button
max_text_width = max(font.size("Enter your Email")[0], font.size("Enter the password")[0], font.size("Sign In")[0])
max_box_width = max(input_box_width, max_text_width) + 100  # Add some padding
max_box_height = 230  # Height of all text and input boxes combined
text_box_rect = pygame.Rect((screen_width - max_box_width) // 2, (screen_height - max_box_height) // 2 - 30, max_box_width, max_box_height)

# Sign-in button setup
button_width, button_height = 100, 40
button_x = (screen_width - button_width) // 2  # Center the button horizontally
button_y = screen_height // 2 + 100  # Position the button below the input boxes
button_rect = pygame.Rect(button_x, button_y, button_width, button_height)
button_color = pygame.Color('black')
button_text = font.render("Sign In", True, WHITE)
button_text_rect = button_text.get_rect(center=button_rect.center)

# Authentication status
authenticated = False

def authenticate_user(email, password):
    user = user_collection.find_one({"email": email, "password": password})
    return user is not None


# Running control

running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.MOUSEBUTTONDOWN:
            if input_box_email.collidepoint(event.pos):
                active_email = True
                active_password = False
            elif input_box_password.collidepoint(event.pos):
                active_email = False
                active_password = True
            elif button_rect.collidepoint(event.pos):
                # Perform sign-in action here
                email = text_email
                password = text_password
                if authenticate_user(email, password):
                    print("Sign In successful")
                    authenticated = True
                    display_main_game_screen()
                    tempCodeRunnerFile.main(email)

                else:
                    print("Invalid username or password")
            else:
                active_email = False
                active_password = False
            color_email = color_active if active_email else color_inactive
            color_password = color_active if active_password else color_inactive
        if event.type == pygame.KEYDOWN:
            if active_email:
                if event.key == pygame.K_RETURN:
                    print("Email: ", text_email)
                    # You can perform further actions with the username here
                elif event.key == pygame.K_BACKSPACE:
                    text_email = text_email[:-1]
                else:
                    text_email += event.unicode
            elif active_password:
                if event.key == pygame.K_RETURN:
                    print("Password: ", text_password)
                    text_password = ''  # This could reset password or handle login
                elif event.key == pygame.K_BACKSPACE:
                    text_password = text_password[:-1]
                else:
                    text_password += event.unicode
                # Adjust the width of the password input box based on the length of the text
                input_box_password.w = max(input_box_width, font.size(text_password)[0] + 10)
        # Handle window resize events
        if event.type == pygame.VIDEORESIZE:
            screen = pygame.display.set_mode((event.w, event.h), pygame.RESIZABLE)
            screen_width, screen_height = event.w, event.h
            # Recalculate the positions of the input boxes based on the new window size
            text_box_rect = pygame.Rect((screen_width - max_box_width) // 2, (screen_height - max_box_height) // 2 - 30, max_box_width, max_box_height)
            input_box_email.center = (screen_width // 2, screen_height // 2 - 50)
            input_box_password.center = (screen_width // 2, screen_height // 2 + 50)
            # Recalculate the position of the sign-in button
            button_x = (screen_width - button_width) // 2
            button_y = screen_height // 2 + 100
            button_rect.topleft = (button_x, button_y)
            button_text_rect = button_text.get_rect(center=button_rect.center)


    # Blit background image onto the screen
    screen.blit(background_image, (0, 0))

    # Draw the box covering all text and the sign-in button
    pygame.draw.rect(screen, WHITE, text_box_rect)

    # Render and display text input elements
    txt_surface_email = font.render(text_email, True, color_email)
    txt_surface_password = font.render("*" * len(text_password), True, color_password)
    input_box_email.w = max(input_box_width, txt_surface_email.get_width() + 10)
    input_box_password.w = max(input_box_width, txt_surface_password.get_width() + 10)
    screen.blit(txt_surface_email, (input_box_email.x + 3, input_box_email.y + 3))
    screen.blit(txt_surface_password, (input_box_password.x + 3, input_box_password.y + 3))

    pygame.draw.rect(screen, color_email if not active_email else highlight_color, input_box_email, 2)  # Highlight when active
    pygame.draw.rect(screen, color_password, input_box_password, 2)

    # Render and display "Enter the username" text
    enter_email_text = font.render("Enter your Email", True, BLACK)
    screen.blit(enter_email_text, ((screen_width - enter_email_text.get_width()) // 2, input_box_email.y - 30))
    # Render and display "Enter the password" text
    enter_password_text = font.render("Enter the password", True, BLACK)
    screen.blit(enter_password_text, ((screen_width - enter_password_text.get_width()) // 2, input_box_password.y - 30))

    # Draw and display sign-in button
    pygame.draw.rect(screen, button_color, button_rect)
    screen.blit(button_text, button_text_rect)

    pygame.display.flip()

pygame.quit()