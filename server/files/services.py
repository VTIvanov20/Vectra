from django.contrib.auth.models import User
from .models import File


class FileStorage:
    """
    Services for the files
    """

    @classmethod
    def get_images_for_user(cls, user_id: int):
        return File.objects.filter(user_id=user_id).values_list('user_id', flat=True)

    @classmethod
    def create_image(cls, user_id: User, name: str, image: bytes):
        file = File(user_id=user_id, name=name, image=image)
        file.save()

    @classmethod
    def get_image_by_user(cls, user_id: User, id: int):
        try:
            file = File.objects.get(user_id=user_id, id=id)
            return file
        except File.DoesNotExist:
            return None

    @classmethod
    def delete_image_by_user(cls, user_id: User, id: int):
        File.objects.get(user_id=user_id, id=id).delete()