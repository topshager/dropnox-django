from django.contrib import admin
from django.urls import include ,path
from .views import MyTokenObtainPairView, MyTokenRefreshView, ProtectedView
from . import views
from . import views

urlpatterns = [

    path('',views.user_auth ,name='auth'),

    path('register',views.user_register ,name='register'),

    path('home',views.home , name='home'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('api/protected/', ProtectedView.as_view(), name='protected_view'),


    #path('upload_folder',views.)
    #path('create_folder',views.),
    #path('drag_drop_folder',views.),

    #path('upload_file',views.),
    #path('drag_drop_file',views.)
]
