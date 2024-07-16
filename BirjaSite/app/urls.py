from django.urls import path

from .views import *

urlpatterns = [
    path('', indexPage.as_view(), name="index"),
    path('trade/', tradePage.as_view(), name="trade"),
    path('registration/', RegistrationPage.as_view(), name="registration"),
    path('login/', LoginPage.as_view(), name="login"),
    path('logout/', logout_user, name="logout"),
    path('get_bitcoin_data/', get_bitcoin_data),
    path('get_blockchain_data/', get_blockchain_data),
    path('get-crypto-price/<str:symbol>/', get_crypto_price, name='get_crypto_price'),
    path('update-profits/', update_profits, name='update_profits'),
]