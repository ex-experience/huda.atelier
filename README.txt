ATELIER HUDA — الحزمة الكاملة V6

الموقع بعد الدفع:
https://ex-experience.github.io/huda.atelier/

طريقة أ: PowerShell
1) Keep في المتصفح إن ظهر تحذير.
2) فك الضغط.
3) في PowerShell كمسؤول:

Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
cd "$env:USERPROFILE\Downloads\ATELIER-HUDA-COMPLETE"
Unblock-File .\INSTALL.ps1
.\INSTALL.ps1

طريقة ب: نسخ الملفات
انسخ محتويات مجلد huda.atelier فوق المستودع ثم:
git add -A
git commit -m "V6 complete"
git push origin main

سوبربيز: شغّل supabase/schema.sql ثم الصق المفاتيح في assets/js/supabase-config.js
هاتف +966 54 556 5606 — إنستغرام hudaoalamoudi
