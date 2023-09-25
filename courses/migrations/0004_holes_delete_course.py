# Generated by Django 4.2.4 on 2023-08-11 14:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0003_course_par_course_slope_course_stroke_index_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Holes',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('course', models.CharField(max_length=10)),
                ('hole', models.PositiveIntegerField(default=1)),
                ('tees', models.CharField(max_length=7)),
                ('yards', models.PositiveIntegerField(default=200)),
                ('par', models.PositiveIntegerField(default=4)),
                ('stroke_index', models.PositiveIntegerField(default=1)),
            ],
        ),
        migrations.DeleteModel(
            name='Course',
        ),
    ]
