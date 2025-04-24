from django.shortcuts import render
from rest_framework import serializers
from .models import Folder
from .models import sharableLink
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth.hashers import make_password
import logging
from django.shortcuts import get_object_or_404
import base64
from rest_framework import serializers
from .models import File,Folder
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







class FileSerializer(serializers.ModelSerializer):
    content = serializers.SerializerMethodField()

    def get_content(self, obj):
        if obj.content:  # Ensure content exists
            return base64.b64encode(obj.content).decode('utf-8')  # Convert bytes to base64
        return None

    class Meta:
        model = File
        fields = ['file_id', 'name', 'type', 'content', 'user', 'created_at', 'updated_at']
class FolderSerializer(serializers.ModelSerializer):
     files = FileSerializer(many=True,required=False)
     subfolders =FileSerializer(many=True,required=False)
     class Meta:

          model = Folder
          fields = [ 'folder_id','name','parent','type','files','subfolders','user','created_at','updated_at']
     def get_subfolder(self,obj):
          return FolderSerializer(obj.subfolders.all(), many=True).data
     def create(self, validated_data):
        files_data = validated_data.pop('files', [])
        folder = Folder.objects.create(**validated_data)
        for file_data in files_data:
            File.objects.create(folder=folder, **file_data)
        return folder





@api_view(['GET'])
@permission_classes([IsAuthenticated])
def home(request):
           try:
                user_id = request.user.id

                folders = Folder.objects.filter(user=user_id,parent=None)
                files  = File.objects.filter(user=user_id,folder=None)

                folder_data = FolderSerializer(folders, many=True).data
                file_data = FileSerializer(files, many=True).data

                user_data ={
                    'folders':  folder_data,
                    'files':  file_data,
                }

                return Response({'data': user_data}, status=status.HTTP_200_OK)
           except Exception as e:
                logger = logging.getLogger(__name__)
                logger.error(f"Error fetching data for user {request.user.id}: {e}")
                return Response(
                    {'error': 'An error occurred while fetching data. Please try again later.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def subfolder(request,id):
        try:
             user_id = request.user.id
             parent_folder_id = id
             folders = Folder.objects.filter(user=user_id,parent=parent_folder_id)
             files = File.objects.filter(user=user_id,folder=parent_folder_id)

             folder_data =FolderSerializer(folders,many=True).data
             file_data = FileSerializer(files,many=True).data
             user_data ={
                    'folders':  folder_data,
                    'files':  file_data,
             }
             return Response({'data':user_data},status=status.HTTP_200_OK)
        except Exception as e:
                logger = logging.getLogger(__name__)
                logger.error(f"Error fetching data for user {request.user.id}: {e}")
                return Response(
                    {'error': 'An error occurred while fetching data. Please try again later.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_folder(request,id):
    data = request.data.copy()
    data['user'] = request.user.id
    if (id !=0):
        data['parent'] = id

    serializer = FolderSerializer(data=data )
    if serializer.is_valid():
        folder = serializer.save()
        return Response({'message': 'Folder created successfully!', 'folder': serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def home_upload_file(request, id):
    logger = logging.getLogger(__name__)
    logger.debug(f"Raw Request Data: {request.data}")

    if 'file' not in request.FILES:
        return Response({'error': 'No file uploaded.'}, status=status.HTTP_400_BAD_REQUEST)

    uploaded_file = request.FILES['file']


    folder = get_object_or_404(Folder, folder_id=id) if id != 0 else None

    file_instance = File(
        name=uploaded_file.name,
        folder=folder,
        type=uploaded_file.content_type,
        content=uploaded_file.read(),
        user=request.user
    )
    file_instance.save()

    return Response({'message': 'File uploaded successfully!', 'file': FileSerializer(file_instance).data}, status=status.HTTP_201_CREATED)

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



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bin_Api(request,delete_id):
    data = request.data
    user_id = request.user.id

    object_type = data.get("type")
    if object_type == "File":
        file_id = delete_id
        file = get_object_or_404(File, user_id=user_id, file_id=file_id)
        file.delete()

    elif object_type == "Folder":
         folder_id = delete_id
         folder = get_object_or_404(Folder,user=user_id,folder_id=folder_id )
         folder.delete()

    return JsonResponse({"message": "recorde deleted"}, status=201)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def bin(request):
  try:

     user=request.user
     files = File.objects.filter(user=user, is_deleted=True)
     folders =Folder.objects.filter(user=user, is_deleted=True)

     file_data =FileSerializer(files,many=True).data
     folder_data = FolderSerializer(folders,many=True).data
     return Response({'folders': folder_data,'files': file_data }, status=status.HTTP_200_OK)
  except Exception as e:
                logger = logging.getLogger(__name__)
                logger.error(f"Error fetching data for user {request.user.id}: {e}")
                return Response(
                    {'error': 'An error occurred while fetching data. Please try again later.'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Name_Change(request,ID):
    data = request.data
    object_id = ID
    object_Name = data.get("changed_Name")
    object_type = data.get("type")
    user_id = request.user.id

    if (object_type == "file"):
         file = File.objects.filter(user=user_id,file_id=object_id)
         file.update(name=object_Name)
         return JsonResponse({"message": "Name updated"}, status=201)

    folder = Folder.objects.filter(user=user_id,folder_id=object_id)
    folder.update(name= object_Name)
    return JsonResponse({"message": " folder Name updated"}, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def restore(request,ID):
    data = request.data
    object_Name = data.get("name")
    object_type = data.get("type")
    user_id = request.user.id
    if (object_type == "file"):
         file = get_object_or_404(File,user=user_id,file_id=ID)
         file.restore()
    elif    (object_type=="folder"):
         folder =  get_object_or_404(Folder,user=user_id,folder_id=ID)
         folder.restore()
    return JsonResponse({"message": "recorde restored"}, status=201)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete(request,ID):
    data = request.data
    object_type = data.get("type")
    user_id = request.user.id
    if (object_type == "file"):
         file = get_object_or_404(File,user=user_id,file_id=ID)
         file.hard_delete()
    elif    (object_type=="folder"):
         folder =  get_object_or_404(Folder,user=user_id,folder_id=ID)
         folder.hard_delete()
    return JsonResponse({"message": "recorde deleted"}, status=201)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def Drag_and_Drop(request):
     data = request.data
     user_id = request.user.id
     file_id = data['file_id']
     folder = data['folder_id']



     obj_update = File.objects.filter(user=user_id,file_id=file_id)
     obj_update.update(folder=folder)


     return JsonResponse({"message": "what you doing bud"},status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def sharable(request,ID,type):
    user_id = request.user.id
    object_id = ID
    object_type = type
    if type == "file":
        token = sharableLink.object.filter(user=user_id,)
    if type == "folder":
        token = sharableLink.object.filter(user=user_id,)
         
     
    return JsonResponse({"message": "object returned"},status=201)