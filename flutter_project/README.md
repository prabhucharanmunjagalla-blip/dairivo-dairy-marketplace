# Dairivo – Complete Flutter Dairy Marketplace Application

A modern, production-grade Flutter mobile application connecting dairy farmers directly with buyers across India.

## 🚀 Key Features

- **Multilingual Support**: Real-time localization across 10 Indian languages (English, Telugu, Hindi, Tamil, Kannada, Malayalam, Bengali, Gujarati, Marathi, Punjabi).
- **Dual Authentication**: Farmer Login and Buyer Login using Firebase Phone OTP Authentication (+91 Indian mobile verification).
- **Farmer Dashboard**: 5 navigation tabs (Home, Orders, Post Product, Payments, Profile).
- **Quality Dairy Attributes**: Milking session (Morning/Evening), Fat %, SNF %, Units (Liters, Kg).
- **Buyer Marketplace**: Search, category filters, location detection, real-time order placement.
- **Order Management Workflow**: Pending ➔ Confirmed ➔ Out for Delivery ➔ Delivered with automatic inventory deduction.
- **Farmer Payments Dashboard**: Audited earnings calculation, pending collections, and transaction receipts.
- **Hardware Integration**: Device camera and gallery photo uploads for profile pictures and product listings.

## 🛠 Prerequisites

1. Flutter SDK `>= 3.0.0`
2. Android Studio with Android SDK 34+
3. Firebase Project with:
   - Phone Authentication enabled
   - Cloud Firestore database provisioned
   - Firebase Storage enabled

## 📦 Step-by-Step Setup & Build Release APK

### 1. Clone & Install Dependencies
```bash
cd dairivo_flutter
flutter pub get
```

### 2. Configure Firebase Android
1. Open the [Firebase Console](https://console.firebase.google.com).
2. Create a project named `Dairivo`.
3. Add an Android app with package name: `com.dairivo.app`.
4. Download `google-services.json` and place it in:
   `android/app/google-services.json`
5. Enable **Phone Authentication** under Firebase Authentication > Sign-in method.
6. Deploy the included `firestore.rules` to Firestore.

### 3. Run in Debug Mode
```bash
flutter run
```

### 4. Build Release Android APK
```bash
flutter build apk --release --split-per-abi
```
The generated release APKs will be located at:
`build/app/outputs/flutter-apk/app-arm64-v8a-release.apk`
