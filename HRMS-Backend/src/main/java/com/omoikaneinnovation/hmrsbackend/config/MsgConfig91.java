package com.omoikaneinnovation.hmrsbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MsgConfig91 {

    @Value("${msg91.authkey}")
    private String authKey;

    @Value("${msg91.sender.id}")
    private String senderId;

    @Value("${msg91.enabled:true}")
    private boolean enabled;

    public String getAuthKey() {
        return authKey;
    }

    public String getSenderId() {
        return senderId;
    }

    public boolean isEnabled() {
        return enabled;
    }
}