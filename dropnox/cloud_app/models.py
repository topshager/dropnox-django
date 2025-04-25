from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
# Create your models here.


class User(AbstractUser):
    username = models.CharField(max_length=77, unique=True)  

   
    REQUIRED_FIELDS = ['email']  

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
    is_deleted = models. BooleanField(default=False)
    created_at = models.DateField(auto_now=True)
    updated_at = models.DateField(auto_now=True)

    def delete(self,*args,**kwargs):
        self.is_deleted = True
        self.save()
        self.files.update(is_deleted=True)


    def restore(self):
        self.is_deleted= False
        self.save()
        self.files.update(is_deleted=False)

    def hard_delete(self):
        self.files.all().delete()
        super().delete()

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
    is_deleted = models. BooleanField(default=False)

    def delete(self,*args,**kwargs):
        self.is_deleted = True
        self.save()


    def restore(self):
        self.is_deleted =False
        self.save()

    def hard_delete(self):
        super().delete()


    def __str__(self):
        return self.name



class sharableLink(models.Model):
    folder = models.ForeignKey(Folder,null=True,blank=True,on_delete=models.CASCADE)
    file = models.ForeignKey(File,null=True,blank=True,on_delete=models.CASCADE)

    token =  models.UUIDField(default=uuid.uuid4, unique=True,editable=False)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)