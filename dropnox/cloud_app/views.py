from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['POST'])
def user_auth(request):
    if request.method == 'POST':

        data = request.data
        name = data.get('username')
        password = data.get('password')
        #Database connection   and  checking credentials in the database

        return Response({'message': 'Data recieved succesfully'})





    return 1
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
