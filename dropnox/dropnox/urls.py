from django.contrib import admin
from django.urls import path,include
from cloud_app import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.home,name='home'),
    path('login/', views.login_view ,name='login'),
    path('upload',views.upload_view,name='upload'),
    path("register/",views.register_view ,name='register'),
    path('folder', views.folder_view,name='folder'),
    path('api/auth/',include('cloud_app.urls')),
    path('api/register/',include('cloud_app.urls')),
    path('api/home/',include('cloud_app.urls')),
]
