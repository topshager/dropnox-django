from django.contrib import admin
from django.urls import include ,path

from . import views

urlpatterns = [

    path('api/auth',views.user_auth ,name='authenticate_user'),

    #path('register,views.),


    #path('upload_folder',views.)
    #path('create_folder',views.),
    #path('drag_drop_folder',views.),

    #path('upload_file',views.),
    #path('drag_drop_file',views.)


]
