package com.omoikaneinnovation.hmrsbackend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String message;
    private String type;       // info | warning | success | pending
    private String userId;     // target user id (or "admin" for admin-wide)
    private String link;       // optional navigate link
    private int badge;         // badge count (0 = none)
    private String createdAt;
    private boolean read;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getLink() { return link; }
    public void setLink(String link) { this.link = link; }

    public int getBadge() { return badge; }
    public void setBadge(int badge) { this.badge = badge; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }
}
