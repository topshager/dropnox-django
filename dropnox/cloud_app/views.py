from django.shortcuts import render
from django.template import loader
from django.http import HttpResponse

# Create your views here.
def home(request):
    template = loader.get_template("hompage/home.html")
    return HttpResponse(template.render(request))

def login_view(request):
    template = loader.get_template("auth/login.html")
    return HttpResponse(template.render(request))
