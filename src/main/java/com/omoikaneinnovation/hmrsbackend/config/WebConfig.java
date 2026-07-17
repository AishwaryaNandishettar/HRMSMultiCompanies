package com.omoikaneinnovation.hmrsbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Get absolute path to uploads directory
        String uploadPath = Paths.get("uploads").toAbsolutePath().toUri().toString();
        
        System.out.println("🔧 WebConfig: Serving uploads from: " + uploadPath);
        
        // Serve uploads directory
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadPath, "file:uploads/")
                .setCachePeriod(3600); // Cache for 1 hour
    }
    // CORS is handled entirely by SecurityConfig.corsConfigurationSource()
    // Do NOT add addCorsMappings here — it conflicts with Spring Security CORS
}