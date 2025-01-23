from django.contrib import admin
from django.urls import path
from .views import MyTokenObtainPairView, MyTokenRefreshView, ProtectedView
from . import views
from . import views

urlpatterns = [

    path('register/',views.user_register ,name='register'),
    path('home/',views.home , name='home'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('protected/', ProtectedView.as_view(), name='protected_view'),
    path('home_upload/', views.home_upload_folder,name='home_upload'),
]
