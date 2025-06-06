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
    path('upload_file/<int:id>', views.home_upload_file,name='upload file'),
    path('upload_folder/<int:id>',views.upload_folder,name='upload folder'),
    path('new_folder/<int:id>',views.upload_folder,name='new folder'),
    path('bin_Api/<int:delete_id>',views.bin_Api,name='bin_Api'),
    path('edit/<int:ID>',views.Name_Change,name='edit_name'),
    path('bin/',views.bin,name="bin"),
    path('restore/<int:ID>' ,views.restore,name="restore"),
    path('delete/<int:ID>' ,views.delete ,name="delete"),
    path('move-file/',views.Drag_and_Drop, name="Dnd"),
    path('sharable/<int:ID>/<str:type>/',views.sharable, name="share"),
    path('shared/<uuid:token>/',views.shared_view,name='shared-view'),
]
