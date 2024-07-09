from django.urls import path

from .views import *

urlpatterns = [
    path('', indexPage.as_view(), name="index")
]