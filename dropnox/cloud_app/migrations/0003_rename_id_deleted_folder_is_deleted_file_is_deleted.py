# Generated by Django 5.1.4 on 2025-02-16 16:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("cloud_app", "0002_folder_id_deleted"),
    ]

    operations = [
        migrations.RenameField(
            model_name="folder",
            old_name="id_deleted",
            new_name="is_deleted",
        ),
        migrations.AddField(
            model_name="file",
            name="is_deleted",
            field=models.BooleanField(default=False),
        ),
    ]
