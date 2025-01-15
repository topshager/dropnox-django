from django.contrib import admin
from django.urls import include ,path

from . import views

urlpatterns = [

    path('',views.user_auth ,name='auth'),

    path('register',views.user_register ,name='register'),


    #path('upload_folder',views.)
    #path('create_folder',views.),
    #path('drag_drop_folder',views.),

    #path('upload_file',views.),
    #path('drag_drop_file',views.)
]
