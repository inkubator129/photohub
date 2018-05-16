import random
import string
import os


def generate_user_folder(user_id, username):
    directory_name = ''.join(['id_', str(user_id), 'u_', username, '/'])
    directory = ''.join([os.environ['BASE_DIR'], 'id_', str(user_id), 'u_', username, '/'])
    os.makedirs(directory)
    return directory_name


def generate_filename(filename):
    name = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(10))
    name += filename
    return name