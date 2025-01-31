from django.contrib import admin
from django.urls import path
from .views import MyTokenObtainPairView, MyTokenRefreshView, ProtectedView
from . import views

urlpatterns = [

    path('register/',views.user_register ,name='register'),
    path('home/',views.home , name='home'),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('subfolder/<int:id>',views.subfolder,name='subfolder'),
    path('protected/', ProtectedView.as_view(), name='protected_view'),
    path('home_upload/', views.home_upload_file,name='upload file'),
    path('upload_folder/',views.upload_folder,name='upload folder'),

]
