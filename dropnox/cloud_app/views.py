from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
import logging
logger = logging.getLogger(__name__)

from cloud_app.models import User,Folder,File
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login
from django.contrib.auth import authenticate
from django.http import JsonResponse

class customTokenObtainPairSerializer(TokenObtainPairSerializer):
     def validate(self,attrs):
         data = super().validate(attrs)
         user = self.user
         data['user_id'] = user.id
         data['username'] = user.username
         return data



MyTokenObtainPairView
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = customTokenObtainPairSerializer
    def post(self,request,*args,**kwargs):
         logger.info("Requested data:", request.data)
         response = super().post(request, *args, **kwargs)
         logger.info("Response data:", response.data)
         return response

class MyTokenRefreshView(TokenRefreshView):
    pass

class ProtectedView(APIView):
      permission_classes = [[IsAuthenticated]]
      def get(self, request):
        return Response({"message": "You have access to this protected view!"})

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
