# models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    def create_user(self, email, full_name, phone, date_of_birth, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, full_name=full_name, phone=phone, date_of_birth=date_of_birth, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, full_name, phone, date_of_birth, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, full_name, phone, date_of_birth, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, unique=True)
    date_of_birth = models.DateField()
    balance = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    demo_balance = models.DecimalField(max_digits=10, decimal_places=2, default=50000)
    profit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    demo_profit = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    date_joined = models.DateTimeField(default=timezone.now)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    groups = models.ManyToManyField(Group, related_name='customuser_set', blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name='customuser_set', blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['full_name', 'phone', 'date_of_birth']

    def __str__(self):
        return self.email

    @property
    def last_trade_date(self):
        last_trade = self.position_set.order_by('-open_time').first()
        return last_trade.open_time if last_trade else None

    @property
    def favorite_crypto(self):
        favorite = self.position_set.values('crypto__name').annotate(total=models.Count('crypto')).order_by(
            '-total').first()
        return favorite['crypto__name'] if favorite else None

    @property
    def most_profitable_day(self):
        trades = self.position_set.values('open_time__date').annotate(profit_sum=models.Sum('profit')).order_by(
            '-profit_sum').first()
        return trades['open_time__date'] if trades else None

    @property
    def total_withdrawn(self):
        return self.withdrawals.aggregate(total=models.Sum('amount'))['total'] or 0.00

class CryptoCurrency(models.Model):
    name = models.CharField(max_length=50)
    symbol = models.CharField(max_length=10)
    img = models.ImageField(upload_to="Img/", verbose_name="Изображение продукта")

    def __str__(self):
        return self.name

class Position(models.Model):
    POSITION_TYPES = (
        ('long', 'Long'),
        ('short', 'Short'),
    )

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    crypto = models.ForeignKey(CryptoCurrency, on_delete=models.CASCADE)
    position_type = models.CharField(max_length=5, choices=POSITION_TYPES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    open_price = models.DecimalField(max_digits=10, decimal_places=2)
    open_time = models.DateTimeField(auto_now_add=True)
    duration = models.IntegerField()
    closed = models.BooleanField(default=False)
    demo = models.BooleanField(default=False)
    profit = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.crypto.symbol} - {self.position_type}"

class Withdrawal(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='withdrawals')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.amount}"
