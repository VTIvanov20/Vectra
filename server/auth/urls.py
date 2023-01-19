from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import ObtainTokenPairView, RegisterView

router = DefaultRouter()
router.register('auth/register', RegisterView, basename='auth_register')

urlpatterns = [
    path('auth/login/', ObtainTokenPairView.as_view()),
]

urlpatterns += router.urls
