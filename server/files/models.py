from django.db import models
from django.contrib.auth.models import User


class File(models.Model):
    user_id = models.ForeignKey(to=User, on_delete=models.CASCADE)
    name = models.CharField(max_length=1024)
    image = models.ImageField(upload_to='server/server/images')
