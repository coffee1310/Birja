from django.urls import path

from .views import *

urlpatterns = [
    path('', indexPage.as_view(), name="index"),
    path('trade/', tradePage.as_view(), name="trade"),
    path('get_bitcoin_data/', get_bitcoin_data),
    path('get_blockchain_data/', get_blockchain_data)
]