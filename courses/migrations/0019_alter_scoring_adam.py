# Generated by Django 4.2.4 on 2023-08-22 16:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0018_scoring_hole'),
    ]

    operations = [
        migrations.AlterField(
            model_name='scoring',
            name='adam',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
