    package com.omoikaneinnovation.hmrsbackend.dto;

    public class LoginRequest {
        private String email;
        private String password;
        private String tenantId; // ✅ Add tenant ID for multi-tenant validation

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getTenantId() { return tenantId; }
        public void setTenantId(String tenantId) { this.tenantId = tenantId; }
    }
