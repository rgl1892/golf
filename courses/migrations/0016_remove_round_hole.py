# Generated by Django 4.2.4 on 2023-08-22 15:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0015_remove_round_adam_remove_round_alex_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='round',
            name='hole',
        ),
    ]
