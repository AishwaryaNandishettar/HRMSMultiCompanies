package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Notification;
import com.omoikaneinnovation.hmrsbackend.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    /* ── Get all notifications (used by admin home page) ── */
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    /* ── Get notifications for a specific user ── */
    public List<Notification> getByUser(String userId) {
        return notificationRepository.findByUserId(userId);
    }

    /* ── Save a new notification ── */
    public Notification save(Notification notification) {
        if (notification.getCreatedAt() == null) {
            notification.setCreatedAt(
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
            );
        }
        if (notification.getType() == null) {
            notification.setType("info");
        }
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    /* ── Mark a notification as read ── */
    public Notification markRead(String id) {
        Notification n = notificationRepository.findById(id).orElse(null);
        if (n != null) {
            n.setRead(true);
            return notificationRepository.save(n);
        }
        return null;
    }

    /* ── Delete a notification ── */
    public void delete(String id) {
        notificationRepository.deleteById(id);
    }
}
