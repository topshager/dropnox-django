from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

from django.http import JsonResponse

@api_view(['POST'])
def user_auth(request):
    if request.method == 'POST':

        data = request.data
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username= username,password = password)
        if user is not None:
            return JsonResponse({"message": "Login successful!"}, status=200)
        else:
            return JsonResponse({"message": "Invalid username or password"}, status=400)
def home(request):
    return render(request, 'cloud_app/home.html')  # No need for a context if not passing data

def login_view(request):
    return render(request, 'auth/login.html')

def register_view(request):
    return render(request,'auth/register.html')

def folder_view(request):
    return render(request, 'cloud_app/folder.html')
def upload_view(request):
    return render(request,'cloud_app/upload.html')
