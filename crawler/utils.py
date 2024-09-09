def log(logger, message):
    logger.write(message + "\n")
    print(message)

def prompt_bool(message):
    while(True):
        user_input = input(message + " ").lower()

        if user_input == "yes" or user_input == "y":
            return True
        elif user_input == "no" or user_input == "n":
            return False

        print("Invalid input. ", end = "")

