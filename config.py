import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'saep_db.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'minha-chave-secreta-forte'