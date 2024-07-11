import requests
from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView, FormView, ListView, DetailView
from django.http import JsonResponse

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