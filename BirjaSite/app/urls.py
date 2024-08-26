from django.urls import path

from .views import *

urlpatterns = [
    path('', indexPage.as_view(), name="index"),
    path('fast_start/', fastStartPage.as_view(), name="fast_start"),
    path('trade/', tradePage.as_view(), name="trade"),
    path('demo_trade/', demoTradePage.as_view(), name="demo_trade"),
    path('registration/', RegistrationPage.as_view(), name="registration"),
    path('login/', LoginPage.as_view(), name="login"),
    path('logout/', logout_user, name="logout"),
    path('history/', PositionListView.as_view(), name='history'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('deposit/', DepositView.as_view(), name="deposit"),
    path('withdraw/', withdraw, name='withdraw'),
    path('get_bitcoin_data/', get_bitcoin_data),
    path('get_blockchain_data/', get_blockchain_data),
    path('get-crypto-price/<str:symbol>/', get_crypto_price, name='get_crypto_price'),
    path('update-profits/', update_profits, name='update_profits'),
    path('update_demo_balance/', update_demo_balance, name='update_demo_balance'),
    path('update_balance/', update_balance, name='update_balance'),
    path('check_balance/', check_balance, name='check_balance'),
    path('check_demo_balance/', check_demo_balance, name="check_demo_balance"),
    path('latest-demo-profit/', get_latest_demo_profit, name='latest-demo-profit'),
    path('latest-profit/', get_latest_profit, name="latest-profit"),
    path('trade-demo-history/', trade_demo_history, name='trade_history'),
]