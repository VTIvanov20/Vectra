from azure.core.exceptions import ResourceExistsError
from azure.storage.blob import BlobServiceClient, BlobClient
from django.conf import settings


class FileStorage:
    container_name = 'images'
    client: BlobServiceClient = None

    def __init__(self):
        self.client = BlobServiceClient.from_connection_string(settings.AZURE_CONNECTION_STRING)

    def create_client(self, user_id: int):
        try:
            self.client.create_container(name=str(user_id))
        except ResourceExistsError:
            return False
        return True

    @property
    def blob_client(self) -> BlobClient:
        return self.client

    