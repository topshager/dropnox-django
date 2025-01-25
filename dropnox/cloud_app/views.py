from django.shortcuts import render
from rest_framework import serializers
from .models import Folder
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.hashers import make_password
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
      permission_classes = [IsAuthenticated]
      def get(self, request):
        return Response({"message": "You have access to this protected view!"})

class FolderSerializer(serializers.ModelSerializer):
     class Meta:
          model = File
          fields = [ 'file_id','name','folder','type','content','user','created_at','updated_at']


    # def validate(self,value):
    #        allowed_types = ['document', 'image', 'video','pdf']
    #        if value not in allowed_types:
    #            raise serializers.ValidationError(f"Folder type must be one of {allowed_types}")
    #        return value


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
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def create_folder(request):

     pass

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_folder(reuest):
     pass

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def home_upload_file(request):
    logger = logging.getLogger(__name__)
    logger.debug(f"Raw Request Data: {request.data}")
    data = request.data.dict() if hasattr(request.data, 'dict') else request.data
    data['user'] = request.user.id
    if 'type' not in data:
        return Response({'error': 'The "type" field is required.'}, status=status.HTTP_400_BAD_REQUEST)

    serializer = FolderSerializer(data=data)
    if serializer.is_valid():
        file = serializer.save()
        logger.info(f"Folder created successfully: {file}")
        return Response(
            {"message": "Folder created successfully!", "folder": FolderSerializer(file).data},
            status=status.HTTP_201_CREATED,
        )
    logger.error(f"Serializer errors: {serializer.errors}")
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def user_register(request):
         data = request.data
         username = data.get('username')
         password = data.get('password')

         if  not  username or not password:
               return JsonResponse({"message":"Username and password are required"},status=400)
         if User.objects.filter(username=username).exists():
            return JsonResponse({"message": "username is not available"}, status=400)

         new_user = User(username=username,password=make_password(password))
         new_user.save()
         return JsonResponse({"message": "User registered successfully!"}, status=201)
