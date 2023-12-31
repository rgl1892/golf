# Generated by Django 4.2.4 on 2023-08-11 14:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('courses', '0006_delete_hole'),
    ]

    operations = [
        migrations.CreateModel(
            name='Hole',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.CharField(max_length=10)),
                ('tees', models.CharField(max_length=7)),
                ('hole', models.PositiveIntegerField(default=1)),
                ('yards', models.PositiveIntegerField(default=200)),
                ('par', models.PositiveIntegerField(default=4)),
                ('stroke_index', models.PositiveIntegerField(default=1)),
            ],
        ),
    ]
