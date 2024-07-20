from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser, Position
from django.contrib.auth import authenticate

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
    username = forms.EmailField(widget=forms.EmailInput(attrs={'placeholder': 'Эл. почта'}), label='Эл. почта')
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Пароль'}), label='Пароль')

    def clean(self):
        email = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        if email and password:
            self.user_cache = authenticate(self.request, username=email, password=password)
            if self.user_cache is None:
                raise forms.ValidationError("Пожалуйста, введите правильный адрес электронной почты и пароль. Оба поля могут быть чувствительны к регистру.")
        else:
            raise forms.ValidationError("Оба поля должны быть заполнены.")
        return self.cleaned_data

    def get_user(self):
        return self.user_cache

class PositionForm(forms.ModelForm):
    class Meta:
        model = Position
        fields = ['crypto', 'position_type', 'amount', 'duration']
        widgets = {
            'crypto': forms.Select(),
            'position_type': forms.RadioSelect(),
            'duration': forms.NumberInput(attrs={'min': 1, 'step': 1}),
        }

class PositionFilterForm(forms.Form):
    PERIOD_CHOICES = [
        ('all_time', 'За все время'),
        ('year', 'За год'),
        ('month', 'За месяц'),
    ]
    OUTCOME_CHOICES = [
        ('any', 'Любой исход'),
        ('positive', 'Положительный'),
        ('negative', 'Отрицательный'),
    ]
    POSITION_TYPE_CHOICES = [
        ('all', 'Все типы операций'),
        ('long', 'Длинная'),
        ('short', 'Короткая'),
    ]

    period = forms.ChoiceField(choices=PERIOD_CHOICES, label="Период", required=False)
    outcome = forms.ChoiceField(choices=OUTCOME_CHOICES, label="Исход", required=False)
    position_type = forms.ChoiceField(choices=POSITION_TYPE_CHOICES, label="Тип операции", required=False)

class ProfileForm(forms.ModelForm):
    date_of_birth = forms.DateField(
        widget=forms.DateInput(format='%Y-%m-%d'),
        input_formats=['%Y-%m-%d']
    )

    class Meta:
        model = CustomUser
        fields = ['full_name', 'email', 'date_of_birth']

class DepositForm(forms.Form):
    wallet_address = forms.CharField(label='Адрес кошелька', max_length=100)
    amount = forms.DecimalField(label='Сумма пополнения', max_digits=10, decimal_places=2)