from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, CryptoCurrency,Position
from .forms import CustomUserCreationForm
# Register your models here.
class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserCreationForm
    model = CustomUser
    list_display = ('email', 'full_name', 'phone', 'date_of_birth', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('full_name', 'phone', 'date_of_birth', 'balance', 'profit')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'full_name', 'phone', 'date_of_birth', 'password1', 'password2', 'is_staff', 'is_active', 'groups', 'user_permissions')}
        ),
    )
    search_fields = ('email',)
    ordering = ('email',)

admin.site.register(CustomUser, CustomUserAdmin)

class CryptoCurrencyAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "symbol")
    list_display_links = ("name",)
    search_fields = ("name", "symbol")

admin.site.register(CryptoCurrency, CryptoCurrencyAdmin)

class PositionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "crypto", "position_type", "amount", "open_price", "open_time", "duration", "closed", "profit")
    list_display_links = ("crypto", "position_type", "user", "amount")
    search_fields = ("crypto", "user")

admin.site.register(Position, PositionAdmin)