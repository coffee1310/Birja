import requests
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login
from django.views.generic import TemplateView, FormView, ListView, DetailView, CreateView
from django.contrib.auth.views import LoginView
from django.http import JsonResponse
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.views import View
from decimal import Decimal
import threading
import time
import json

from app.models import *
from app.forms import *
# Create your views here.
class indexPage(TemplateView):
    template_name = "app/index.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

    def get(self, request, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        return self.render_to_response(context)

class fastStartPage(TemplateView):
    template_name = "app/fast_start.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

    def get(self, request, *args, **kwargs):
        context = super().get_context_data(**kwargs)
        return self.render_to_response(context)

class tradePage(LoginRequiredMixin, TemplateView):
    template_name = "app/trade.html"
    login_url = '/login'
    redirect_field_name = 'redirect_to'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cryptos'] = CryptoCurrency.objects.all()
        context['balance'] = self.request.user.balance
        return context

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            crypto_symbol = data.get('crypto')
            amount = float(data.get('amount'))
            duration = int(data.get('duration'))
            position_type = data.get('position_type')

            current_price = self.get_current_price(crypto_symbol)

            crypto = CryptoCurrency.objects.get(symbol=crypto_symbol)

            position = Position.objects.create(
                user=request.user,
                crypto=crypto,
                position_type=position_type,
                amount=amount,
                open_price=current_price,
                duration=duration
            )

            threading.Thread(target=self.process_position, args=(position.id,)).start()

            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    def get_current_price(self, symbol):
        api_key = 'b2f300377672777aa258f397ac6c22f5c1fa12191e41ac68f82196aadf99478c'
        url = f'https://min-api.cryptocompare.com/data/price?fsym={symbol}&tsyms=USD&api_key={api_key}'
        response = requests.get(url)
        data = response.json()
        return data['USD']

    def process_position(self, position_id):
        position = Position.objects.get(id=position_id)

        user = position.user
        if user.balance < position.amount:
            redirect('deposit')
            position.delete()
            return 0

        user.balance -= position.amount
        time.sleep(position.duration)
        current_price = Decimal(self.get_current_price(position.crypto.symbol))

        payout_percent = Decimal(0.70)

        if position.position_type == 'long':
            if current_price > Decimal(position.open_price):
                profit = Decimal(position.amount) * payout_percent
            else:
                profit = -Decimal(position.amount)
        else:
            if current_price < Decimal(position.open_price):
                profit = Decimal(position.amount) * payout_percent
            else:
                profit = -Decimal(position.amount)

        position.profit = profit
        position.closed = True
        position.save()

        user.balance += Decimal(profit) + position.amount if profit > 0 else 0
        user.profit += Decimal(profit)
        user.save()


class demoTradePage(LoginRequiredMixin, TemplateView):
    template_name = "app/demo_trade.html"
    login_url = '/login'
    redirect_field_name = 'redirect_to'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['cryptos'] = CryptoCurrency.objects.all()
        context['balance'] = self.request.user.demo_balance
        return context

    @method_decorator(login_required)
    def post(self, request, *args, **kwargs):
        try:
            data = json.loads(request.body)
            crypto_symbol = data.get('crypto')
            amount = float(data.get('amount'))
            duration = int(data.get('duration'))
            position_type = data.get('position_type')

            current_price = self.get_current_price(crypto_symbol)

            crypto = CryptoCurrency.objects.get(symbol=crypto_symbol)

            position = Position.objects.create(
                user=request.user,
                crypto=crypto,
                position_type=position_type,
                amount=amount,
                open_price=current_price,
                duration=duration,
                demo=True
            )

            threading.Thread(target=self.process_position, args=(position.id,)).start()
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=500)

    def get_current_price(self, symbol):
        api_key = 'b2f300377672777aa258f397ac6c22f5c1fa12191e41ac68f82196aadf99478c'
        url = f'https://min-api.cryptocompare.com/data/price?fsym={symbol}&tsyms=USD&api_key={api_key}'
        response = requests.get(url)
        data = response.json()
        return data['USD']

    def process_position(self, position_id):
        position = Position.objects.get(id=position_id)
        user = position.user

        if user.demo_balance < position.amount:
            position.delete()
            return 0

        user.demo_balance -= position.amount
        time.sleep(position.duration)
        current_price = Decimal(self.get_current_price(position.crypto.symbol))

        payout_percent = Decimal(0.70)

        if position.position_type == 'long':
            if current_price > Decimal(position.open_price):
                profit = Decimal(position.amount) * payout_percent
            else:
                profit = -Decimal(position.amount)
        else:  # short position
            if current_price < Decimal(position.open_price):
                profit = Decimal(position.amount) * payout_percent
            else:
                profit = -Decimal(position.amount)

        position.profit = profit
        position.closed = True
        print(position.profit)
        position.save()

        user.demo_balance += Decimal(profit) + position.amount if profit > 0 else 0
        user.demo_profit += Decimal(profit)
        user.save()

class RegistrationPage(CreateView):
    template_name = "app/registration.html"
    model = CustomUser
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('index')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['balance'] = 0
        return context

    def form_valid(self, form):
        response = super().form_valid(form)
        login(self.request, self.object)
        return response

    def form_invalid(self, form):
        context = self.get_context_data(form=form)
        context['form_errors'] = form.errors.as_json()
        return self.render_to_response(context)


class LoginPage(LoginView):
    form_class = CustomLoginForm
    template_name = 'app/login.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['balance'] = 0
        return context

    def form_valid(self, form):
        user = form.get_user()
        login(self.request, user)
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy("index")

class PositionListView(LoginRequiredMixin, ListView):
    model = Position
    template_name = 'app/history.html'
    context_object_name = 'positions'
    login_url = '/login'
    redirect_field_name = 'redirect_to'

    def get_queryset(self):
        queryset = super().get_queryset().filter(user=self.request.user)
        form = PositionFilterForm(self.request.GET)

        if form.is_valid():
            period = form.cleaned_data.get('period')
            outcome = form.cleaned_data.get('outcome')
            position_type = form.cleaned_data.get('position_type')

            if period == 'year':
                queryset = queryset.filter(open_time__gte=timezone.now() - timezone.timedelta(days=365))
            elif period == 'month':
                queryset = queryset.filter(open_time__gte=timezone.now() - timezone.timedelta(days=30))

            if outcome == 'positive':
                queryset = queryset.filter(profit__gt=0)
            elif outcome == 'negative':
                queryset = queryset.filter(profit__lt=0)

            if position_type == 'long':
                queryset = queryset.filter(position_type='long')
            elif position_type == 'short':
                queryset = queryset.filter(position_type='short')

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['form'] = PositionFilterForm(self.request.GET)
        context['balance'] = self.request.user.balance
        return context

class ProfileView(LoginRequiredMixin, DetailView):
    model = CustomUser
    template_name = 'app/profile.html'
    context_object_name = 'user'
    login_url = '/login'
    redirect_field_name = 'redirect_to'

    def get_object(self, queryset=None):
        return self.request.user

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form = ProfileForm(request.POST, instance=self.object)

        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully')
            return redirect('trade')
        else:
            messages.error(request, 'Please correct the error below.')

        return self.render_to_response(self.get_context_data(form=form))

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['last_trade_date'] = self.object.last_trade_date
        context['favorite_crypto'] = self.object.favorite_crypto
        context['most_profitable_day'] = self.object.most_profitable_day
        context['total_withdrawn'] = self.object.total_withdrawn
        context['balance'] = self.request.user.balance
        if 'form' not in context:
            context['form'] = ProfileForm(instance=self.object)
        return context


class DepositView(View):
    def get(self, request):
        form = DepositForm()
        crypto = CryptoCurrency.objects.all()
        balance = self.request.user.balance
        return render(request, 'app/deposit.html', {'form': form, 'crypto':crypto, 'balance':balance})

    def post(self, request):
        form = DepositForm(request.POST)
        balance = self.request.user.balance
        if form.is_valid():
            wallet_address = form.cleaned_data['wallet_address']
            amount = form.cleaned_data['amount']
            return redirect('success_page')
        return render(request, 'app/deposit.html', {'form': form, 'balance':balance})

@login_required
def withdraw(request):
    return render(request, context={'balance':request.user.balance}, template_name='app/withdraw.html')

def get_bitcoin_data(request):
    url = 'https://api.blockchain.com/charts/market-price'
    params = {
        'timespan': '100days',
        'format': 'json',
        'cors': 'true',
        'currency': 'USD'
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()
        return JsonResponse(data)
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': str(e)})

def get_blockchain_data(request):
    url = 'https://api.blockchain.com/charts/market-price?timespan=100days&format=json&currency=USD'
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return JsonResponse(data)
    else:
        return JsonResponse({'error': 'Failed to fetch data from Blockchain API'}, status=500)

def logout_user(request):
    logout(request)
    return redirect("index")

def get_current_price(self, symbol):
    api_key = 'b2f300377672777aa258f397ac6c22f5c1fa12191e41ac68f82196aadf99478c'  # Замените на ваш ключ API
    url = f'https://min-api.cryptocompare.com/data/price?fsym={symbol}&tsyms=USD&api_key={api_key}'
    response = requests.get(url)
    data = response.json()
    return data['USD']

@login_required
def update_profits(request):
    user_positions = Position.objects.filter(user=request.user, closed=False)
    positions_data = []

    for position in user_positions:
        current_price = get_current_price(position.crypto.symbol)
        if position.position_type == 'long':
            profit = (float(current_price) - position.open_price) / float(current_price) * position.amount
        else:
            profit = (float(position.open_price) - current_price) / position.open_price * position.amount

        position.profit = profit
        position.save()

        if timezone.now() >= position.open_time + timezone.timedelta(seconds=position.duration):
            position.closed = True
            position.save()

        positions_data.append({
            'id': position.id,
            'profit': profit
        })

    return JsonResponse({'positions': positions_data})

def get_crypto_price(request, symbol):
    api_key = 'b2f300377672777aa258f397ac6c22f5c1fa12191e41ac68f82196aadf99478c'  # Замените на ваш ключ API
    url = f'https://min-api.cryptocompare.com/data/price?fsym={symbol}&tsyms=USD&api_key={api_key}'
    try:
        response = requests.get(url)
        data = response.json()
        return JsonResponse({'price': data['USD']})
    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': str(e)}, status=500)

@login_required
@csrf_exempt
def check_balance(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        amount = float(data.get('amount', 0))
        duration = int(data.get('duration', 0))
        if amount < 1:
            return JsonResponse({'balance_ok': False})

        user_account = request.user
        balance_ok = user_account.balance >= amount

        return JsonResponse({'balance_ok': balance_ok})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

@login_required
@csrf_exempt
def check_demo_balance(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        amount = float(data.get('amount', 0))
        duration = int(data.get('duration', 0))
        if amount < 1:
            return JsonResponse({'balance_ok': False})

        user_account = request.user
        balance_ok = user_account.demo_balance >= amount

        return JsonResponse({'balance_ok': balance_ok})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)

def update_demo_balance(request):
    if request.method == 'POST':
        user = request.user
        return JsonResponse({
            'status': 'success',
            'new_balance': float(user.demo_balance),
            'new_profit': float(user.demo_profit),
        })
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

def update_balance(request):
    if request.method == 'POST':
        user = request.user
        return JsonResponse({
            'status': 'success',
            'new_balance': float(user.balance),
            'new_profit': float(user.profit),
        })
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})

def error_404_view(request, exception):
    return redirect('trade')

def get_latest_demo_profit(request):
    latest_profit = Position.objects.filter(user=request.user, demo=True)
    latest_profit = latest_profit.latest('id')
    data = {
        'profit': latest_profit.profit,
        'date': latest_profit.open_time
    }
    return JsonResponse(data)

def get_latest_profit(request):
    latest_profit = Position.objects.filter(user=request.user, demo=False)
    latest_profit = latest_profit.latest('id')
    data = {
        'profit': latest_profit.profit,
        'date': latest_profit.open_time
    }
    return JsonResponse(data)