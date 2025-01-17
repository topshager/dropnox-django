from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    username = models.CharField(max_length=77, unique=True)
    password = models.CharField(max_length=55)
    REQUIRED_FIELDS = [username,password]
    USERNAME_FIELD = 'username'

    def __str__(self):
        return self.username


class Folder(models.Model):
    folder_id = models.AutoField(primary_key=True)
    name = models.TextField()
    parent = models.ForeignKey(
        'self',null=True ,blank=True,on_delete = models.CASCADE,related_name='subfolder'
    )
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='folders')
    type = models.CharField(max_length=255)
    created_at = models.DateField(auto_now=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.name

class File(models.Model):
    file_id = models.AutoField(primary_key=True)
    name = models.TextField()
    folder = models.ForeignKey(
        Folder,null=True,blank=True ,on_delete=models.CASCADE,related_name='files'
    )
    type = models.CharField(max_length=255)
    content = models.BinaryField()
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name='files')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

# Created user: user20 with password: password20
