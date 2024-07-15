import requests
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.contrib.auth import login
from django.views.generic import TemplateView, FormView, ListView, DetailView, CreateView
from django.contrib.auth.views import LoginView
from django.http import JsonResponse
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required

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

class tradePage(TemplateView):
    template_name = "app/trade.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

class RegistrationPage(CreateView):
    template_name = "app/registration.html"

    model = CustomUser
    form_class = CustomUserCreationForm
    success_url = reverse_lazy('index')

    def form_valid(self, form):
        response = super().form_valid(form)
        login(self.request, self.object)
        return response

class LoginPage(LoginView):
    form_class = CustomLoginForm
    template_name = 'app/login.html'

    def form_valid(self, form):
        user = form.get_user()
        login(self.request, user)
        print(1)
        return super().form_valid(form)

    def get_success_url(self):
        print(2)
        return reverse_lazy("index")

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


@login_required
def open_position(request):
    if request.method == 'POST':
        form = PositionForm(request.POST)
        if form.is_valid():
            position = form.save(commit=False)
            position.user = request.user
            # Получение текущей цены криптовалюты из внешнего API
            current_price = get_current_price(position.crypto.symbol)
            position.open_price = current_price
            position.save()
            return redirect('dashboard')
    else:
        form = PositionForm()

    return render(request, 'open_position.html', {'form': form})


@login_required
def open_position(request):
    if request.method == 'POST':
        form = PositionForm(request.POST)
        if form.is_valid():
            position = form.save(commit=False)
            position.user = request.user
            current_price = get_current_price(position.crypto.symbol)
            position.open_price = current_price
            position.save()
            return redirect('dashboard')
    else:
        form = PositionForm()
    return render(request, 'app/trade.html', {'form': form})

@login_required
def dashboard(request):
    user_positions = Position.objects.filter(user=request.user, closed=False)
    return render(request, 'app/dashboard.html', {'positions': user_positions})

def get_current_price(symbol):
    # API для получения текущей цены криптовалюты
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
            profit = (current_price - position.open_price) * position.amount
        else:
            profit = (position.open_price - current_price) * position.amount

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