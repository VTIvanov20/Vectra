from django.urls import path
from django.urls import include

import auth.urls as auth

urls = [
    path('', include(auth.urlpatterns)),
]

urlpatterns = [
    path('api/',include(urls))
]
