from rest_framework.decorators import renderer_classes
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.http import HttpRequest, StreamingHttpResponse
from django.core.files.base import ContentFile
from .services import FileStorage
from server.renderers import PNGRenderer, JPEGRenderer


class FilesViewSet(ViewSet):
    """
    Viewset for files
    """
    authentication_classes = [JWTAuthentication, ]

    def list(self, request: HttpRequest):
        return Response(FileStorage.get_images_for_user(user_id=request.user.id))

    def create(self, request: HttpRequest):
        try:
            for i in request.FILES.values():
                FileStorage.create_image(user_id=request.user, name=i.name, image=i)
            return Response({"status": "ok"})
        except Exception as e:
            return Response({"status": "failed", "message": str(e)}, 400)

    @renderer_classes((PNGRenderer, JPEGRenderer,))
    def retrieve(self, request: HttpRequest, pk=None):
        if pk is None or int(pk) < 0:
            return Response("Id of image is invalid", 400)

        img = FileStorage.get_image_by_user(user_id=request.user, id=pk)

        if img is None:
            return Response({"status": "failed", "message": "Image with this id doesn't exist"}, 404)

        response = StreamingHttpResponse(open(img.image.path, 'rb'))
        response['Content-Type'] = 'image'
        return response

    def destroy(self, request: HttpRequest, pk=None):
        FileStorage.delete_image_by_user(user_id=request.user, id=pk)
        return Response({"status": "ok"})