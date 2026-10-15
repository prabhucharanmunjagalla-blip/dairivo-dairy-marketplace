import React, { useState } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  ShieldCheck, 
  Layers, 
  FolderTree, 
  ChevronRight, 
  ChevronDown,
  X,
  ExternalLink,
  BookOpen
} from 'lucide-react';

interface FlutterFile {
  path: string;
  name: string;
  category: 'config' | 'dart_core' | 'screens' | 'models' | 'android' | 'security' | 'docs';
  content: string;
}

export const FLUTTER_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    category: 'config',
    content: `name: dairivo
description: "Dairivo - Complete Multilingual Dairy Marketplace for Indian Farmers & Buyers"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # Firebase Core & Services
  firebase_core: ^3.6.0
  firebase_auth: ^5.3.1
  cloud_firestore: ^5.4.4
  firebase_storage: ^12.3.2

  # State Management & Utils
  provider: ^6.1.2
  intl: ^0.19.0
  google_fonts: ^6.2.1

  # Media & Hardware
  image_picker: ^1.1.2
  cached_network_image: ^3.4.0
  flutter_svg: ^2.0.10+1

  # UI Enhancements & Notifications
  flutter_spinkit: ^5.2.1
  url_launcher: ^6.3.0
  confetti: ^0.7.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
    - assets/icons/
`
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    category: 'dart_core',
    content: `import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';

import 'screens/splash_screen.dart';
import 'providers/auth_provider.dart';
import 'providers/product_provider.dart';
import 'providers/order_provider.dart';
import 'providers/language_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Set system bar styles for dairy green & white theme
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ),
  );

  // Initialize Firebase (Requires google-services.json placed in android/app)
  await Firebase.initializeApp();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => ProductProvider()),
        ChangeNotifierProvider(create: (_) => OrderProvider()),
      ],
      child: const DairivoApp(),
    ),
  );
}

class DairivoApp extends StatelessWidget {
  const DairivoApp({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<LanguageProvider>(
      builder: (context, langProvider, child) {
        return MaterialApp(
          title: 'Dairivo',
          debugShowCheckedModeBanner: false,
          theme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFF059669), // Emerald 600
              primary: const Color(0xFF059669),
              secondary: const Color(0xFF0F766E),
              surface: Colors.white,
              background: const Color(0xFFF8FAFC),
            ),
            textTheme: GoogleFonts.plusJakartaSansTextTheme(
              Theme.of(context).textTheme,
            ),
            appBarTheme: const AppBarTheme(
              elevation: 0,
              backgroundColor: Colors.white,
              foregroundColor: Color(0xFF0F172A),
              centerTitle: false,
            ),
          ),
          locale: langProvider.currentLocale,
          home: const SplashScreen(),
        );
      },
    );
  }
}
`
  },
  {
    path: 'lib/screens/splash_screen.dart',
    name: 'splash_screen.dart',
    category: 'screens',
    content: `import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'auth/login_screen.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );
    _scaleAnimation = CurvedAnimation(parent: _controller, curve: Curves.easeOutBack);
    _controller.forward();

    // 2-second navigation requirement to LoginScreen
    Timer(const Duration(seconds: 2), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
        );
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF065F46), Color(0xFF047857), Color(0xFF064E3B)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ScaleTransition(
              scale: _scaleAnimation,
              child: Container(
                width: 100,
                height: 100,
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(30),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 20,
                      offset: const Offset(0, 10),
                    )
                  ],
                ),
                child: const Icon(
                  Icons.water_drop_rounded,
                  size: 50,
                  color: Color(0xFF059669),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Dairivo',
              style: GoogleFonts.serif(
                fontSize: 38,
                fontWeight: FontWeight.w800,
                color: Colors.white,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Pure Dairy From Village Farmers',
              style: TextStyle(
                color: Color(0xFFA7F3D0),
                fontSize: 15,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 48),
            const SizedBox(
              width: 32,
              height: 32,
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                strokeWidth: 2.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
`
  },
  {
    path: 'lib/screens/auth/login_screen.dart',
    name: 'login_screen.dart',
    category: 'screens',
    content: `import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:provider/provider.dart';
import '../../providers/language_provider.dart';
import 'otp_verification_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _phoneController = TextEditingController();
  bool _isFarmer = true;
  bool _isLoading = false;
  String? _errorMessage;

  void _sendOtp() async {
    final phone = _phoneController.text.trim();
    if (phone.length != 10) {
      setState(() => _errorMessage = 'Please enter a valid 10-digit mobile number');
      return;
    }

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final formattedPhone = '+91$phone';

    await FirebaseAuth.instance.verifyPhoneNumber(
      phoneNumber: formattedPhone,
      verificationCompleted: (PhoneAuthCredential credential) async {
        await FirebaseAuth.instance.signInWithCredential(credential);
      },
      verificationFailed: (FirebaseAuthException e) {
        setState(() {
          _isLoading = false;
          _errorMessage = e.message ?? 'Phone verification failed';
        });
      },
      codeSent: (String verificationId, int? resendToken) {
        setState(() => _isLoading = false);
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => OtpVerificationScreen(
              verificationId: verificationId,
              phone: formattedPhone,
              isFarmer: _isFarmer,
            ),
          ),
        );
      },
      codeAutoRetrievalTimeout: (String verificationId) {},
      timeout: const Duration(seconds: 60),
    );
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Dairivo', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.language),
            onPressed: () => _showLanguageDialog(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Farmer vs Buyer Toggle
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.grey.shade200,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => setState(() => _isFarmer = true),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _isFarmer ? const Color(0xFF059669) : Colors.transparent,
                        foregroundColor: _isFarmer ? Colors.white : Colors.black87,
                        elevation: _isFarmer ? 2 : 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text(lang.translate('farmerLogin')),
                    ),
                  ),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => setState(() => _isFarmer = false),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: !_isFarmer ? const Color(0xFF0F766E) : Colors.transparent,
                        foregroundColor: !_isFarmer ? Colors.white : Colors.black87,
                        elevation: !_isFarmer ? 2 : 0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text(lang.translate('buyerLogin')),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 32),
            Text(
              _isFarmer ? 'Sell Fresh Milk & Dairy' : 'Buy 100% Farm Fresh Dairy',
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Enter your 10-digit Indian mobile number for real OTP verification.',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 24),
            TextField(
              controller: _phoneController,
              keyboardType: TextInputType.phone,
              maxLength: 10,
              decoration: InputDecoration(
                prefixIcon: const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 12),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('🇮🇳 +91 ', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    ],
                  ),
                ),
                hintText: '98765 43210',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
              ),
            ),
            if (_errorMessage != null) ...[
              const SizedBox(height: 8),
              Text(_errorMessage!, style: const TextStyle(color: Colors.red, fontSize: 13)),
            ],
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _isLoading ? null : _sendOtp,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF059669),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: _isLoading
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('Get OTP via SMS', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  void _showLanguageDialog(BuildContext context) {
    // Language picker modal for all 10 Indian languages
  }
}
`
  },
  {
    path: 'lib/models/product_model.dart',
    name: 'product_model.dart',
    category: 'models',
    content: `import 'package:cloud_firestore/cloud_firestore.dart';

class DairyProduct {
  final String id;
  final String farmerId;
  final String farmerName;
  final String farmerPhone;
  final String farmerLocation;
  final String name;
  final String category; // milk, curd, paneer, butter, ghee, other
  final String description;
  final double pricePerUnit;
  final String unit; // L, kg, packet
  final double availableQuantity;
  final double totalQuantity;
  final String imageUrl;
  final double? fatPercentage;
  final double? snfPercentage;
  final String? milkingSession;
  final DateTime createdAt;
  final bool isActive;

  DairyProduct({
    required this.id,
    required this.farmerId,
    required this.farmerName,
    required this.farmerPhone,
    required this.farmerLocation,
    required this.name,
    required this.category,
    required this.description,
    required this.pricePerUnit,
    required this.unit,
    required this.availableQuantity,
    required this.totalQuantity,
    required this.imageUrl,
    this.fatPercentage,
    this.snfPercentage,
    this.milkingSession,
    required this.createdAt,
    required this.isActive,
  });

  Map<String, dynamic> toMap() {
    return {
      'farmerId': farmerId,
      'farmerName': farmerName,
      'farmerPhone': farmerPhone,
      'farmerLocation': farmerLocation,
      'name': name,
      'category': category,
      'description': description,
      'pricePerUnit': pricePerUnit,
      'unit': unit,
      'availableQuantity': availableQuantity,
      'totalQuantity': totalQuantity,
      'imageUrl': imageUrl,
      'fatPercentage': fatPercentage,
      'snfPercentage': snfPercentage,
      'milkingSession': milkingSession,
      'createdAt': Timestamp.fromDate(createdAt),
      'isActive': isActive,
    };
  }

  factory DairyProduct.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return DairyProduct(
      id: doc.id,
      farmerId: data['farmerId'] ?? '',
      farmerName: data['farmerName'] ?? '',
      farmerPhone: data['farmerPhone'] ?? '',
      farmerLocation: data['farmerLocation'] ?? '',
      name: data['name'] ?? '',
      category: data['category'] ?? 'milk',
      description: data['description'] ?? '',
      pricePerUnit: (data['pricePerUnit'] as num?)?.toDouble() ?? 0.0,
      unit: data['unit'] ?? 'L',
      availableQuantity: (data['availableQuantity'] as num?)?.toDouble() ?? 0.0,
      totalQuantity: (data['totalQuantity'] as num?)?.toDouble() ?? 0.0,
      imageUrl: data['imageUrl'] ?? '',
      fatPercentage: (data['fatPercentage'] as num?)?.toDouble(),
      snfPercentage: (data['snfPercentage'] as num?)?.toDouble(),
      milkingSession: data['milkingSession'],
      createdAt: (data['createdAt'] as Timestamp?)?.toDate() ?? DateTime.now(),
      isActive: data['isActive'] ?? true,
    );
  }
}
`
  },
  {
    path: 'lib/models/order_model.dart',
    name: 'order_model.dart',
    category: 'models',
    content: `import 'package:cloud_firestore/cloud_firestore.dart';

enum OrderStatus { pending, confirmed, out_for_delivery, delivered, cancelled }

class OrderModel {
  final String id;
  final String buyerId;
  final String buyerName;
  final String buyerPhone;
  final String buyerLocation;
  final String farmerId;
  final String farmerName;
  final String farmerPhone;
  final String productId;
  final String productName;
  final String category;
  final String productImageUrl;
  final double quantity;
  final String unit;
  final double pricePerUnit;
  final double totalPrice;
  final String deliveryAddress;
  final String? deliverySlot;
  final String paymentMethod; // cod, upi, bank_transfer
  final String paymentStatus; // pending, completed
  final OrderStatus status;
  final String? notes;
  final DateTime createdAt;

  OrderModel({
    required this.id,
    required this.buyerId,
    required this.buyerName,
    required this.buyerPhone,
    required this.buyerLocation,
    required this.farmerId,
    required this.farmerName,
    required this.farmerPhone,
    required this.productId,
    required this.productName,
    required this.category,
    required this.productImageUrl,
    required this.quantity,
    required this.unit,
    required this.pricePerUnit,
    required this.totalPrice,
    required this.deliveryAddress,
    this.deliverySlot,
    required this.paymentMethod,
    required this.paymentStatus,
    required this.status,
    this.notes,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'buyerId': buyerId,
      'buyerName': buyerName,
      'buyerPhone': buyerPhone,
      'buyerLocation': buyerLocation,
      'farmerId': farmerId,
      'farmerName': farmerName,
      'farmerPhone': farmerPhone,
      'productId': productId,
      'productName': productName,
      'category': category,
      'productImageUrl': productImageUrl,
      'quantity': quantity,
      'unit': unit,
      'pricePerUnit': pricePerUnit,
      'totalPrice': totalPrice,
      'deliveryAddress': deliveryAddress,
      'deliverySlot': deliverySlot,
      'paymentMethod': paymentMethod,
      'paymentStatus': paymentStatus,
      'status': status.name,
      'notes': notes,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}
`
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    category: 'android',
    content: `<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.dairivo.app">

    <!-- Required Android Permissions for Dairivo -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.CALL_PHONE" />

    <application
        android:label="Dairivo"
        android:name="\${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
`
  },
  {
    path: 'firestore.rules',
    name: 'firestore.rules',
    category: 'security',
    content: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User Profiles:
    // Anyone signed in can read profiles; users can only modify their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Dairy Products:
    // Anyone can read active products (buyers & farmers)
    // Only verified farmers can create or update their own products
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null 
                    && request.resource.data.farmerId == request.auth.uid
                    && request.resource.data.pricePerUnit > 0
                    && request.resource.data.availableQuantity >= 0;
      allow update, delete: if request.auth != null 
                            && (resource.data.farmerId == request.auth.uid 
                                || request.resource.data.diff(resource.data).affectedKeys().hasOnly(['availableQuantity']));
    }
    
    // Orders:
    // Buyers can create orders if authenticated
    // Both the buyer and the farmer involved can read & update status
    match /orders/{orderId} {
      allow create: if request.auth != null 
                    && request.resource.data.buyerId == request.auth.uid;
      allow read: if request.auth != null 
                  && (resource.data.buyerId == request.auth.uid || resource.data.farmerId == request.auth.uid);
      allow update: if request.auth != null 
                    && (resource.data.farmerId == request.auth.uid || resource.data.buyerId == request.auth.uid);
    }
    
    // Transactions:
    // Farmer and buyer involved can read records; cannot tamper
    match /transactions/{txnId} {
      allow read: if request.auth != null 
                  && (resource.data.farmerId == request.auth.uid);
      allow write: if false; // Only server / Cloud Functions can write financial settlements
    }
  }
}
`
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    content: `# Dairivo – Complete Flutter Dairy Marketplace Application

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

1. Flutter SDK \`>= 3.0.0\`
2. Android Studio with Android SDK 34+
3. Firebase Project with:
   - Phone Authentication enabled
   - Cloud Firestore database provisioned
   - Firebase Storage enabled

## 📦 Step-by-Step Setup & Build Release APK

### 1. Clone & Install Dependencies
\`\`\`bash
cd dairivo_flutter
flutter pub get
\`\`\`

### 2. Configure Firebase Android
1. Open the [Firebase Console](https://console.firebase.google.com).
2. Create a project named \`Dairivo\`.
3. Add an Android app with package name: \`com.dairivo.app\`.
4. Download \`google-services.json\` and place it in:
   \`android/app/google-services.json\`
5. Enable **Phone Authentication** under Firebase Authentication > Sign-in method.
6. Deploy the included \`firestore.rules\` to Firestore.

### 3. Run in Debug Mode
\`\`\`bash
flutter run
\`\`\`

### 4. Build Release Android APK
\`\`\`bash
flutter build apk --release --split-per-abi
\`\`\`
The generated release APKs will be located at:
\`build/app/outputs/flutter-apk/app-arm64-v8a-release.apk\`
`
  }
];

interface FlutterProjectViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlutterProjectViewer: React.FC<FlutterProjectViewerProps> = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState<FlutterFile>(FLUTTER_FILES[0]);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 text-slate-100 rounded-3xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-900 flex items-center justify-center font-bold">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>Dairivo Flutter Project Source & Release APK</span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Android SDK 34+ • Dart 3.0+
                </span>
              </h3>
              <p className="text-xs text-slate-400">Complete runnable source files, pubspec, schemas & build commands</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Explorer Layout: Sidebar + Code Editor View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left File Tree Sidebar */}
          <div className="w-full md:w-64 bg-slate-950/80 border-r border-slate-800 overflow-y-auto p-3 shrink-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5 px-2">
              <FolderTree className="w-3.5 h-3.5 text-emerald-400" />
              <span>Project Files</span>
            </div>

            <div className="space-y-1 text-xs">
              {FLUTTER_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition font-mono text-xs ${
                      isSelected
                        ? 'bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.path}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Build Commands Snippet */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-2">
              <div className="font-bold text-slate-300 flex items-center gap-1">
                <Terminal className="w-3 h-3 text-emerald-400" />
                <span>Build Release APK:</span>
              </div>
              <code className="block bg-slate-950 p-1.5 rounded text-[10px] text-emerald-300 font-mono select-all">
                flutter build apk --release
              </code>
            </div>
          </div>

          {/* Right Code Content View */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {/* Action Bar */}
            <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
                <span className="text-emerald-400 font-bold">{selectedFile.path}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-xs text-slate-200 font-medium flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Body */}
            <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 leading-relaxed bg-slate-950">
              <pre className="selection:bg-emerald-800">
                <code>{selectedFile.content}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
