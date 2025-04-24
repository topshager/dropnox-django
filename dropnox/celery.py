from celery import Celery
import os
from django.conf import settings 
import sys


sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE','dropnox.settings')

app = Celery('dropnox')


app.config_from_object('django.config:settings',namespace='CELERY')


app.autodiscover_tasks()

@app.task(bind=True)
def debug_tasks(self):
    print(f'request:{self.request!r}')
    