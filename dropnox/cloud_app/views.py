from django.shortcuts import render
from rest_framework.decorators import api_view
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
    if request.method == 'POST':

        data = request.data
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username= username,password = password)
        if user is not None:

            login(request, user)
            user_id = user.id  # Retrieve the user's ID
            print(user_id)
            return JsonResponse({
                "message": "Login successful!",
                "user_id": user_id  # Include the user ID in the response
            }, status=200)
        else:
            return JsonResponse({"message": "Invalid username or password"}, status=400)


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    @api_view(['GET'])
    def home(request):

        if request.method == 'GET':
            user_id = request.user.id
            folders = Folder.objects.filter(user=user_id).values()
            files  = File.objects.filter(user=user_id,folder=None).values()



            user_data ={
                'folders': list(folders),
                'files': list(files),
            }


            return JsonResponse({'data':user_data })



def user_register(request):
    if request.method == 'POST':
         data = request.data
         username = data.get('username')
         password = data.get('password')
         user = authenticate(username= username)
         if  not user:

             new_user = User(username = username,password = password)
             new_user.save()
         else:
            return JsonResponse({"message": "username is not available"}, status=400)

#def folder_view(request):

#    return render(request, 'cloud_app/folder.html')
#def upload_view(request):
#    return render(request,'cloud_app/upload.html')
#
