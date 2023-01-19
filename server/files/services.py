from azure.storage.blob import BlobServiceClient, BlobClient
from django.conf import settings


class FileStorage:
    container_name = 'images'

    client: BlobServiceClient = None

    def __init__(self):
        self.client = BlobServiceClient.from_connection_string(settings.AZURE_CONNECTION_STRING)

    @property
    def blob_client(self) -> BlobClient:
        return self.client

    