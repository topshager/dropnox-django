# Generated by Django 5.1.4 on 2025-02-16 15:56

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("cloud_app", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="folder",
            name="id_deleted",
            field=models.BooleanField(default=False),
        ),
    ]
