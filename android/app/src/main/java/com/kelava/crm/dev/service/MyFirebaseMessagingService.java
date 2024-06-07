package com.kelava.crm.dev.service;

import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.kelava.crm.dev.MainActivity;

public class MyFirebaseMessagingService extends FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Log.d("FIRENOTIF","onMessageReceived");
        //if (remoteMessage.getNotification() != null) {
            sendNotification(remoteMessage.getData().get("title"));
        //}

    }


    public void sendNotification(String messageBody) {
        Log.d("FIRENOTIF","sendNotification");
        NotificationManager notificationManager = null;
        notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        NotificationCompat.Builder notificationBuilder;

        notificationBuilder = new NotificationCompat.Builder(this)
                .setContentTitle("Notification")
                .setContentText(messageBody)
                .setPriority(NotificationCompat.PRIORITY_MAX);
        //add sound
        //vibrate
        long[] v = {1000, 1000, 1000, 1000, 1000};
        notificationBuilder.setVibrate(v);
        notificationManager.notify(0, notificationBuilder.build());

        Intent i = new Intent(this, MainActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(i);
    }
}