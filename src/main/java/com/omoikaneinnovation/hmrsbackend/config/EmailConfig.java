package com.omoikaneinnovation.hmrsbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import javax.net.ssl.*;
import java.security.cert.X509Certificate;
import java.util.Properties;
import java.util.concurrent.Executor;

@Configuration
@EnableAsync
@EnableScheduling
public class EmailConfig {

    @Value("${spring.mail.host:#{null}}")
    private String mailHost;

    @Value("${spring.mail.port:587}")
    private int mailPort;

    @Value("${spring.mail.username:#{null}}")
    private String mailUsername;

    @Value("${spring.mail.password:#{null}}")
    private String mailPassword;

    @Value("${spring.task.execution.pool.core-size:5}")
    private int corePoolSize;

    @Value("${spring.task.execution.pool.max-size:20}")
    private int maxPoolSize;

    @Value("${spring.task.execution.pool.queue-capacity:100}")
    private int queueCapacity;

    /**
     * JavaMailSender bean - ONLY created when using SMTP (not Resend)
     * This bean is disabled when resend.enabled=true
     */
    @Bean
    @ConditionalOnProperty(name = "resend.enabled", havingValue = "false", matchIfMissing = false)
    public JavaMailSender javaMailSender() {
        System.out.println("⚠️ WARNING: JavaMailSender bean is being created!");
        System.out.println("⚠️ This means resend.enabled=false or not set correctly!");
        System.out.println("⚠️ Check your Render environment variables!");
        
        // Disable SSL certificate validation for development
        disableSSLValidation();
        
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        
        mailSender.setHost(mailHost);
        mailSender.setPort(mailPort);
        mailSender.setUsername(mailUsername);
        mailSender.setPassword(mailPassword);
        
        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "false");
        props.put("mail.smtp.ssl.trust", "*");
        props.put("mail.smtp.ssl.checkserveridentity", "false");
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");
        props.put("mail.smtp.writetimeout", "10000");
        props.put("mail.debug", "true");
        
        return mailSender;
    }

    @Bean(name = "emailTaskExecutor")
    public Executor emailTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(corePoolSize);
        executor.setMaxPoolSize(maxPoolSize);
        executor.setQueueCapacity(queueCapacity);
        executor.setThreadNamePrefix("EmailAsync-");
        executor.setRejectedExecutionHandler(new java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }

    /**
     * Disable SSL certificate validation for development environments
     * WARNING: Only use this in development, never in production!
     */
    private void disableSSLValidation() {
        try {
            // Create a trust manager that accepts all certificates
            TrustManager[] trustAllCerts = new TrustManager[] {
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() {
                        return null;
                    }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) {
                    }
                    public void checkServerTrusted(X509Certificate[] certs, String authType) {
                    }
                }
            };

            // Install the all-trusting trust manager
            SSLContext sc = SSLContext.getInstance("SSL");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

            // Create all-trusting host name verifier
            HostnameVerifier allHostsValid = new HostnameVerifier() {
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            };

            // Install the all-trusting host verifier
            HttpsURLConnection.setDefaultHostnameVerifier(allHostsValid);
            
            System.out.println("✅ SSL certificate validation disabled for development");
            
        } catch (Exception e) {
            System.err.println("❌ Failed to disable SSL validation: " + e.getMessage());
        }
    }
}