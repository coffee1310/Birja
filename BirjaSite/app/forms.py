from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import CustomUser, Position
from django.contrib.auth import authenticate

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = CustomUser
        fields = ('full_name', 'email', 'phone', 'date_of_birth', 'password1', 'password2')
        widgets = {
            'full_name': forms.TextInput(attrs={'placeholder': 'Full Name'}),
            'email': forms.EmailInput(attrs={'placeholder': 'Email'}),
            'phone': forms.TextInput(attrs={'placeholder': 'Phone'}),
            'date_of_birth': forms.DateInput(attrs={'placeholder': 'Date of Birth', 'type': 'date'}),
            'password1': forms.PasswordInput(attrs={'placeholder': 'Password'}),
            'password2': forms.PasswordInput(attrs={'placeholder': 'Confirm Password'}),
        }

class CustomLoginForm(AuthenticationForm):
    username = forms.EmailField(widget=forms.EmailInput(attrs={'placeholder': 'Email'}), label='Email')
    password = forms.CharField(widget=forms.PasswordInput(attrs={'placeholder': 'Password'}), label='Password')

    def clean(self):
        email = self.cleaned_data.get('username')
        password = self.cleaned_data.get('password')

        if email and password:
            self.user_cache = authenticate(self.request, username=email, password=password)
            if self.user_cache is None:
                raise forms.ValidationError("Please enter a correct email and password. Note that both fields may be case-sensitive.")
        else:
            raise forms.ValidationError("Both fields are required.")
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
        ('all_time', 'All time'),
        ('year', 'Year'),
        ('month', 'Month'),
    ]
    OUTCOME_CHOICES = [
        ('any', 'Any outcome'),
        ('positive', 'Positive'),
        ('negative', 'Negative'),
    ]
    POSITION_TYPE_CHOICES = [
        ('all', 'All types of operations'),
        ('long', 'Long'),
        ('short', 'Short'),
    ]

    period = forms.ChoiceField(choices=PERIOD_CHOICES, label="Period", required=False)
    outcome = forms.ChoiceField(choices=OUTCOME_CHOICES, label="Outcome", required=False)
    position_type = forms.ChoiceField(choices=POSITION_TYPE_CHOICES, label="Operation Type", required=False)


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