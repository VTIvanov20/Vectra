from django.urls import path, include

from .views import TokenObtainPairView, RegisterView

urlpatterns = [
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/register/', RegisterView.as_view(), name='auth_register'),
]