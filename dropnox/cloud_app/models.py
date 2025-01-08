from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    username = models.CharField(max_length=77, unique=True)
    password = models.CharField(max_length=55)
    REQUIRED_FIELDS = [username,password]
    USERNAME_FIELD = 'username'

    def self(self):
        return self.username
    
