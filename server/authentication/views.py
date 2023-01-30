from rest_framework.viewsets import GenericViewSet
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView

from django.contrib.auth.models import User

from .serializers import TokenObtainPairSerializer, RegisterSerializer


class ObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = TokenObtainPairSerializer


class RegisterView(GenericViewSet):
    def create(self, request):
        data = request.data

        serializer_data = RegisterSerializer(data=data)
        if serializer_data.is_valid():
            user: User = serializer_data.save()

            return Response({'status': 'ok'}, 200)

        return Response({'status': 'failed', 'message': serializer_data.errors}, 400)
