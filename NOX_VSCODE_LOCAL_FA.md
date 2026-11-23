# اجرای همین نسخه در VS Code — بدون تغییر طراحی

شاخهٔ فرانت و بکند: `integration/lovable-full-20261123` در مخزن‌های nox و nox-backend. PRها هنوز ادغام یا منتشر نشده‌اند.

ساختار پوشهٔ ویندوز:

- `C:\Users\sajad\Projects\NOX\frontend` برای مخزن nox
- `C:\Users\sajad\Projects\NOX\backend` برای مخزن nox-backend

ابتدا تغییرات شخصی فعلی را حفظ کنید. از git reset/clean یا جایگزین‌کردن .env بکند استفاده نکنید. در هر دو پوشه git fetch origin و git switch integration/lovable-full-20261123 را اجرا کنید. اگر Git به دلیل تغییرات محلی متوقف شد، همان خروجی باید بررسی شود؛ این راه‌انداز stash یا reset خودکار ندارد.

فایل `NOX.code-workspace` در پوشهٔ frontend را با VS Code باز کنید. سپس Terminal > Run Task > NOX: First local setup. یا داخل ترمینال PowerShell پوشهٔ frontend:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\NOX-Start-Local.ps1 -Setup -TestSms
```

پیش‌نیاز: Node 24، PHP نسخهٔ سازگار با composer.lock (روی سیستم شما Herd PHP 8.3)، Composer و MySQL باید موجود باشند؛ دیتابیس محلی nox و .env فعلی آن نگه داشته شود. اگر .env ندارید، .env.example را کپی و اطلاعات واقعی دیتابیس محلی nox را تکمیل کنید. راه‌انداز دیتابیس را ایجاد یا پاک نمی‌کند.

فرمان نخست npm ci و composer install، پاک‌کردن کش تنظیمات، migrationهای افزایشی و storage:link لازم را انجام می‌دهد؛ APP_KEY موجود حفظ می‌شود و فقط اگر خالی باشد ساخته می‌شود. از .env بکند در storage خصوصی نسخه پشتیبان گرفته می‌شود. آدرس فرانت/API و CORS/Sanctum/کوکی برای localhost هماهنگ می‌شوند. حالت -TestSms فقط در APP_ENV=local و دیتابیس MySQL با نام nox مجاز است. کد آزمایشی برگشتی از بکند فقط در توسعه و روی localhost/127.0.0.1 در فرم ورود نمایش داده می‌شود. پیامک واقعی ارسال نمی‌شود و درگاه واقعی خودکار فعال نمی‌شود.

آدرس‌ها:
- سایت: http://127.0.0.1:5173/
- پنل بکند: http://127.0.0.1:8000/admin

ورود پنل با حساب ادمین قبلی خودتان است؛ رمز جدیدی ساخته یا عوض نمی‌شود. اگر ادمین ندارید، ایجاد حساب باید جداگانه انجام شود. اگر پورت‌های ۵۱۷۳ یا ۸۰۰۰ اشغال باشند، راه‌انداز خطا می‌دهد و هیچ پردازشی را نمی‌بندد. دو ترمینال مجزای سرویس باز می‌شوند و باید هر دو فعال بمانند. این اجرا فقط محلی است.

اجرای دفعات بعد:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\NOX-Start-Local.ps1
```

اگر پوشهٔ بکند جای دیگری است، -BackendPath را با مسیر آن بدهید. گزینهٔ -SeedNox اختیاری است: تنظیمات برند NOX و نمونهٔ غیرفعال هر دسته را ثبت می‌کند؛ برای نصب معمولی خودکار اجرا نمی‌شود، چون تنظیمات موجود را نباید بدون بررسی بازنویسی کرد. در نبود محصول منتشرشده، سایت حالت خالی واقعی را نشان می‌دهد؛ مدل و کارت دسته‌ها همچنان حفظ می‌شوند. قیمت و موجودی حدس زده نمی‌شوند.

برای تأیید لاراول روی سیستم کاربر:

```powershell
cd ..\backend
php artisan test --filter=NoxService
php artisan test tests/Feature/CustomerOtpAuthTest.php tests/Feature/PaymentFlowTest.php tests/Feature/NotificationOutboxTest.php
```

تست حساب واقعی کاوه‌نگار و زرین‌پال تا ثبت‌نام و تأیید حساب باقی می‌ماند. راهنمای `NOX_SERVICES_SETUP_FA.md` در بکند برای فعال‌سازی پس از استقرار است. ویندوز و MySQL سیستم کاربر از این محیط قابل اجرا نیستند؛ اجرای واقعی راه‌انداز باید روی سیستم کاربر تأیید شود.
