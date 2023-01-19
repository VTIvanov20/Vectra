from rest_framework.routers import DefaultRouter

from .views import FilesViewSet

router = DefaultRouter()
router.register('files', FilesViewSet, basename='files')

urlpatterns = router.urls