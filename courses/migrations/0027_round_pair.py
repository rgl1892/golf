# Generated by Django 4.2.4 on 2023-10-10 15:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0026_scoring_sandies'),
    ]

    operations = [
        migrations.AddField(
            model_name='round',
            name='pair',
            field=models.CharField(default='Adam & Alex', max_length=20),
        ),
    ]
