from django.contrib.auth.base_user import AbstractBaseUser
from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

class UserManager(BaseUserManager):
    def create_user(self, username: str, email: str, password: str) -> None:
        """
        Creates and saves a User.
        """
        if not email:
            raise Exception("User must have a valid email")

        if not username:
            raise Exception("User must have a valid username")

        user = self.model(
            email = self.normalize_email(email),
            username = username,
        )

        user.set_password(password)
        user.save(using=self._db)

