class Logger:
    def __init__(self, log_file_path):
        self.log_file = open(log_file_path, "a+")
        self.indentation = 0

    def indent(self):
        self.indentation += 1

    def unindent(self):
        self.indentation -= 1

    def newline(self):
        print("")
        self.log_file.write("\n")

    def write(self, message):
        indented_message = ("  " * self.indentation) +  message

        print(indented_message)
        self.log_file.write(indented_message + "\n")

    def close(self):
        self.log_file.close()

