from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from cloud_app.models import User,Folder,File
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.contrib.auth import authenticate
from django.http import JsonResponse


class MyTokenObtainPairView(TokenObtainPairView):
    pass


class MyTokenRefreshView(TokenRefreshView):
    pass

@api_view(['POST'])
def user_auth(request):
        data = request.data
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({"message": "Username and password are required"}, status=400)

        user = authenticate(username= username,password = password)
        if user is not None:
            login(request, user)
            user_id = user.id  # Retrieve the user's ID
            return JsonResponse({
                "message": "Login successful!",
                "user_id": user_id  # Include the user ID in the response
            }, status=200)
        else:
            return JsonResponse({"message": "Invalid username or password"}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def home(request):
            user_id = request.user.id
            folders = Folder.objects.filter(user=user_id).values()
            files  = File.objects.filter(user=user_id,folder=None).values()



            user_data ={
                'folders': list(folders),
                'files': list(files),
            }


            return JsonResponse({'data':user_data })


@api_view(['POST'])
def user_register(request):
         data = request.data
         username = data.get('username')
         password = data.get('password')

         if  not  username or not password:
               return JsonResponse({"message":"Username and password are required"},status=400)
         if User.objects.filter(username=username).exists():
            return JsonResponse({"message": "username is not available"}, status=400)

         new_user = User(username=username,password=password)
         new_user.save()
         return JsonResponse({"message": "User registered successfully!"}, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "You have access to this protected view!"})
