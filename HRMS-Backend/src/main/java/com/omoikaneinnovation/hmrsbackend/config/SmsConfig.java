package com.omoikaneinnovation.hmrsbackend.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class SmsConfig {

    // Enable/Disable SMS
    public static final boolean SMS_ENABLED = true;

    // Simulation mode (set to false for real SMS)
    public static final boolean SMS_SIMULATION_MODE = false;
    
    // ✅ FORCE TWILIO ONLY - Use Twilio for verified numbers
    public static final boolean TWILIO_ONLY_MODE = true;

    // HR Contact Numbers (these should be your verified numbers)
    public static final String PADMANABH_PHONE = "9606408912";  // Verified number
    public static final String AISHWARYA_PHONE = "9930145419";  // Verified number
    
    // ✅ TESTING MODE: Only send SMS to verified numbers
    public static final boolean SMS_TESTING_MODE = false;
    public static final String TEST_PHONE_NUMBER = "9606408912"; // Your verified phone for testing

    // Country code
    public static final String COUNTRY_CODE = "+91";

    // Fast2SMS Configuration (backup - not used when TWILIO_ONLY_MODE = true)
    public static final String SMS_API_KEY = "ZorwgJS8mE72kAU3jDMt0TPK6GOxdsRNHLyXQuViqCWlYcphnzIUYRQ0pPjFdo7Knr8uE65lhMSkvxV4"; 

    public static final String SMS_GATEWAY_URL =
            "https://www.fast2sms.com/dev/bulkV2";

    // WhatsApp
    public static final boolean WHATSAPP_ENABLED = false;

}