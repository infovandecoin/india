import os
import re
import shutil

print("--- RUNNING VANDECOIN ANDROID HOST CONFIGURATION ---")

# 1. Clean and configure exact Kotlin package structure
kotlin_base = "android/app/src/main/kotlin"
target_pkg_dir = os.path.join(kotlin_base, "network", "vandecoin", "app")
shutil.rmtree(kotlin_base, ignore_errors=True)
os.makedirs(target_pkg_dir, exist_ok=True)

main_activity_kt = """package network.vandecoin.app

import io.flutter.embedding.android.FlutterActivity

class MainActivity: FlutterActivity() {
}
"""
with open(os.path.join(target_pkg_dir, "MainActivity.kt"), "w") as f:
    f.write(main_activity_kt)
print(f"Created MainActivity.kt at {target_pkg_dir}")

# 2. Patch android/app/build.gradle.kts
bg_path = "android/app/build.gradle.kts"
with open(bg_path, "r") as f:
    bg = f.read()

# Replace namespace and applicationId
bg = re.sub(r'namespace\s*=\s*"[^"]+"', 'namespace = "network.vandecoin.app"', bg)
bg = re.sub(r'applicationId\s*=\s*"[^"]+"', 'applicationId = "network.vandecoin.app"', bg)

# Disable minification and shrinking in release build to prevent R8 from stripping classes or Flutter channels
release_config = """        release {
            signingConfig = signingConfigs.getByName("debug")
            isMinifyEnabled = false
            isShrinkResources = false
        }"""
bg = re.sub(r'release\s*\{[^}]*signingConfig\s*=\s*signingConfigs\.getByName\("debug"\)[^}]*\}', release_config, bg)

with open(bg_path, "w") as f:
    f.write(bg)
print("Configured android/app/build.gradle.kts")

# 3. Patch AndroidManifest.xml
manifest_path = "android/app/src/main/AndroidManifest.xml"
with open(manifest_path, "r") as f:
    m = f.read()

perms = """    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
    <uses-permission android:name="android.permission.VIBRATE"/>
"""
m = m.replace('<manifest xmlns:android="http://schemas.android.com/apk/res/android">', 
              '<manifest xmlns:android="http://schemas.android.com/apk/res/android">\n' + perms)
m = re.sub(r'android:label="[^"]+"', 'android:label="VandeCoin"', m)
m = re.sub(r'android:name="(\.MainActivity|[^"]*MainActivity)"', 'android:name="network.vandecoin.app.MainActivity"', m)

with open(manifest_path, "w") as f:
    f.write(m)
print("Configured android/app/src/main/AndroidManifest.xml")

print("--- ANDROID HOST CONFIGURATION COMPLETE ---")
