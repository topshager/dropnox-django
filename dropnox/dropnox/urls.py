from django.contrib import admin
from django.urls import path,include
from cloud_app import views
from rest_framework.routers import DefaultRouter
from cloud_app.views import FileViewSet

router = DefaultRouter()
router.register(r'files', FileViewSet, basename='file')
urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.home, name='home'),
    path('api/', include('cloud_app.urls')),
    path('api/', include(router.urls)),  # ← include this line!
]