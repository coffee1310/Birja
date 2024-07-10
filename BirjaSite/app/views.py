from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import TemplateView, FormView, ListView, DetailView

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
