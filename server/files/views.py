from rest_framework.viewsets import ViewSet
from rest_framework.response import Response

from .services import FileStorage

class FilesViewSet(ViewSet):
    file_storage_client = FileStorage()
    def list(self, request):
        return Response(self.file_storage_client.blob_client.blob_name)