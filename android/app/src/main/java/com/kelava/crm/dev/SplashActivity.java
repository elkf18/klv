package com.kelava.crm.dev; // Change this to your package name.

import android.content.Intent;
import android.os.Bundle;

import com.google.firebase.FirebaseApp;

import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FirebaseApp.initializeApp(this);
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();
    }
}