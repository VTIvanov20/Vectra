from django.urls import path
from django.urls import include

import auth.urls as auth
import files.urls as files

urls = [
    path('', include(auth.urlpatterns)),
    path('', include(files.urlpatterns)),
]

urlpatterns = [
    path('api/', include(urls))
]
