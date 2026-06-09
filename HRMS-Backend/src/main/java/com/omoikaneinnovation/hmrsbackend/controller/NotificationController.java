package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Notification;
import com.omoikaneinnovation.hmrsbackend.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    /* ── GET all notifications (admin home page polls this) ── */
    @GetMapping
    public List<Notification> getAll() {
        return notificationService.getAllNotifications();
    }

    /* ── GET notifications for a specific user ── */
    @GetMapping("/user/{userId}")
    public List<Notification> getByUser(@PathVariable String userId) {
        return notificationService.getByUser(userId);
    }

    /* ── POST create a new notification ── */
    @PostMapping
    public Notification create(@RequestBody Notification notification) {
        return notificationService.save(notification);
    }

    /* ── PATCH mark a notification as read ── */
    @PatchMapping("/{id}/read")
    public Notification markRead(@PathVariable String id) {
        return notificationService.markRead(id);
    }

    /* ── DELETE a notification ── */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        notificationService.delete(id);
    }
}
