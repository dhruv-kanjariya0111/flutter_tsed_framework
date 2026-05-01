# Dio / Retrofit
-keep class retrofit.** { *; }
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes EnclosingMethod

# Freezed / json_serializable
-keep class **$*.dart { *; }
-keepclassmembers class * {
    @com.google.gson.annotations.SerializedName <fields>;
}

# Flutter
-keep class io.flutter.** { *; }
-keep class io.flutter.plugins.** { *; }
-keepclassmembers class * implements io.flutter.plugin.common.MethodCallHandler {
    public void onMethodCall(io.flutter.plugin.common.MethodCall, io.flutter.plugin.common.MethodChannel$Result);
}

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**

# Supabase (if used)
-keep class io.supabase.** { *; }
-dontwarn io.supabase.**

# FlutterSecureStorage
-keep class com.it_nomads.fluttersecurestorage.** { *; }

# RevenueCat (if used)
-keep class com.revenuecat.** { *; }

# Prevent stripping R8 rules for reflection-dependent code
-keepclassmembers class * {
    @*.serializable.Serializable *;
}
