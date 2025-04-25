from .models import  sharableLink
from django.utils import timezone
import uuid
def check_expirey(folder=None,file=None):
        query = sharableLink.objects.all()
        if folder:
            query = query.filter(folder=folder)
        if file:
            query = query.filter(file=file)
       
        for link in query:
                if link.expires_at and link.expires_at < timezone.now():
                        link.token = uuid.uuid4()
                        link.expires_at = None
                        link.save()