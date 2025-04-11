# React Native ProGuard Rules

# Keep important React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep Reanimated which was causing our crashes
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Keep Expo and related classes
-keep class expo.** { *; }
-keep class com.swmansion.** { *; }

# Keep Supabase related classes
-keep class io.supabase.** { *; }
-keep class com.google.gson.** { *; }

# Keep our app package
-keep class com.theamal11qw.groceryguj.** { *; }

# For native methods, see http://proguard.sourceforge.net/manual/examples.html#native
-keepclasseswithmembernames class * {
    native <methods>;
}

# Enums (used by Supabase and others)
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# Keep JavaScript interface methods
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
    @com.facebook.react.uimanager.annotations.ReactProp *;
}

# Keep setters in Views (for animations and styling)
-keepclassmembers public class * extends android.view.View {
   void set*(***);
   *** get*();
}

# Keep Parcelable implementations (needed for bundle transfers)
-keepclassmembers class * implements android.os.Parcelable {
    static ** CREATOR;
}

# Keep custom application class
-keep public class com.theamal11qw.groceryguj.MainApplication {
    public <fields>;
    public <methods>;
}

# Hermes JS engine optimizations
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# For Serializable objects
-keepnames class * implements java.io.Serializable
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    !static !transient <fields>;
    !private <fields>;
    !private <methods>;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}

# App-specific rules to prevent crashes
-keepclassmembers class com.swmansion.reanimated.LayoutAnimationsManager {
    *;
}

# Keep Expo modules
-keep class expo.modules.** { *; } 