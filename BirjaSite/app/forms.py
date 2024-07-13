from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('full_name', 'email', 'phone', 'date_of_birth', 'password1', 'password2')
        widgets = {
            'full_name': forms.TextInput(attrs={'placeholder': 'ФИО'}),
            'email': forms.EmailInput(attrs={'placeholder': 'Эл. почта'}),
            'phone': forms.TextInput(attrs={'placeholder': 'Телефон'}),
            'date_of_birth': forms.DateInput(attrs={'placeholder': 'Дата рождения', 'type': 'date'}),
            'password1': forms.PasswordInput(attrs={'placeholder': 'Пароль'}),
            'password2': forms.PasswordInput(attrs={'placeholder': 'Подтвердите пароль'}),
        }

class CustomLoginForm(AuthenticationForm):
    class Meta:
        model = CustomUser
        fields = ('username', 'password')
        widgets = {
            'username': forms.EmailInput(attrs={'placeholder': 'Эл. почта'}),
            'password': forms.PasswordInput(attrs={'placeholder': 'Пароль'}),
        }