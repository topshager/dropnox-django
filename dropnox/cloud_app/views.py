from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'cloud_app/home.html')  # No need for a context if not passing data

def login_view(request):
    return render(request, 'auth/login.html')

def folder_view(request):
    return render(request, 'cloud_app/folder.html')
