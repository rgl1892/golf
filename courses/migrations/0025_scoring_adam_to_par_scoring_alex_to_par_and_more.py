# Generated by Django 4.2.4 on 2023-08-31 12:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0024_scoring_adam_stable_scoring_alex_stable_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='scoring',
            name='adam_to_par',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='scoring',
            name='alex_to_par',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='scoring',
            name='jaime_to_par',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='scoring',
            name='rich_to_par',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
