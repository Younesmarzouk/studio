# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## نشر التطبيق (Deployment)

لنشر هذا التطبيق وجعله متاحًا على الإنترنت، يمكنك استخدام Firebase App Hosting. اتبع الخطوات التالية من جهاز الكمبيوتر المحلي الخاص بك:

**المتطلبات:**
- يجب أن يكون لديك [Node.js](https://nodejs.org/en) مثبتًا على جهازك.
- يجب أن يكون لديك حساب Firebase ومشروع تم إنشاؤه (مشروعك هو `khidmti55`).

**الخطوات:**

1.  **تثبيت أدوات Firebase (Firebase CLI):**
    إذا لم تكن قد ثبتها من قبل، افتح الطرفية (Terminal) على جهازك وقم بتشغيل الأمر التالي:
    ```bash
    npm install -g firebase-tools
    ```

2.  **تسجيل الدخول إلى Firebase:**
    في نفس الطرفية، قم بتسجيل الدخول إلى حسابك في Firebase:
    ```bash
    firebase login
    ```
    سيؤدي هذا إلى فتح نافذة في متصفحك لتسجيل الدخول.

3.  **تهيئة Firebase في مجلد المشروع:**
    اذهب إلى مجلد مشروعك في الطرفية، ثم قم بتشغيل الأمر التالي لربط المجلد بمشروعك على Firebase:
    ```bash
    firebase init apphosting
    ```
    - سيطلب منك اختيار مشروع. اختر مشروعك الحالي (`khidmti55`) من القائمة.
    - سيتم إنشاء ملف `firebase.json` وملف `.firebaserc` في مشروعك.

4.  **نشر التطبيق:**
    أخيرًا، لنشر تطبيقك على الإنترنت، قم بتشغيل الأمر التالي:
    ```bash
    firebase deploy
    ```

بعد اكتمال عملية النشر، ستوفر لك Firebase CLI رابطًا لموقعك المباشر. تهانينا، لقد أصبح تطبيقك الآن على الإنترنت!
