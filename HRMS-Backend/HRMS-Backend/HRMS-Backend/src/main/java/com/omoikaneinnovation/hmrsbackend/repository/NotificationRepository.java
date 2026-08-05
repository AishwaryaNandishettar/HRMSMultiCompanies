package com.omoikaneinnovation.hmrsbackend.repository;

import com.omoikaneinnovation.hmrsbackend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserId(String userId);

    List<Notification> findByUserIdAndRead(String userId, boolean read);
}
