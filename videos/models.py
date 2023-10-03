from django.db import models
from django.urls import reverse

class Vids(models.Model):
    title = models.CharField(max_length=100)
    video = models.FileField(upload_to='')

    def __str__(self) -> str:
        return self.title
    