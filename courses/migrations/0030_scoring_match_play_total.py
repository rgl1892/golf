# Generated by Django 4.2.4 on 2023-10-11 14:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0029_rename_better_ball_scoring_better_ball_team_a_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='scoring',
            name='match_play_total',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]