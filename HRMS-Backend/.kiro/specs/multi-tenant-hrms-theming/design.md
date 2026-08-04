# Design Document: Multi-Tenant HRMS Theming System

## Overview

This design document specifies the technical architecture for transforming the existing single-tenant HRMS application into a multi-tenant system that supports unique branding for multiple companies while maintaining a single codebase. The solution implements a theme engine that dynamically applies visual customizations based on environment configuration without modifying core business logic.

### System Context

The HRMS application consists of:
- **Frontend**: React 19 + Vite application with modular component architecture
- **Backend**: Spring Boot 3.2.5 REST API with WebSocket support for real-time features
- **Database**: MongoDB Atlas shared across all tenants
- **Real-time Communication**: LiveKit integration for chat and video calls

### Design Goals

1. **Single Codebase**: Maintain one repository for all tenant deployments
2. **Visual Isolation**: Apply unique branding per tenant without code duplication
3. **Business Logic Preservation**: Zero changes to authentication, data processing, or API contracts
4. **Scalability**: Support adding new tenants through configuration only
5. **Maintainability**: Bug fixes and features automatically propagate to all tenants

### Tenant Configuration

Three initial tenant companies:

| Tenant ID | Company Name | Primary Color | Secondary Color | Accent Color | Initials |
|-----------|--------------|---------------|-----------------|--------------|----------|
| company-a | TalentHub Solutions | #1E40AF (deep blue) | #3B82F6 (bright blue) | #DBEAFE (light blue) | TH |
| company-b | WorkForce Pro | #047857 (forest green) | #10B981 (emerald green) | #D1FAE5 (light green) | WP |
| company-c | PeopleSync Enterprise | #5B21B6 (deep purple) | #8B5CF6 (bright purple) | #EDE9FE (light purple) | PS |

## Architecture

### High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Browser"
        A[React Application]
        B[Theme Engine]
        C[Theme Configuration Loader]
    end
    
    subgraph "Deployment Layer"
        D1[Vercel Instance A<br/>VITE_TENANT_ID=company-a]
        D2[Vercel Instance B<br/>VITE_TENANT_ID=company-b]
        D3[Vercel Instance C<br/>VITE_TENANT_ID=company-c]
    end
    
    subgraph "Backend Layer"
        E1[Render Instance A]
        E2[Render Instance B]
        E3[Render Instance C]
    end
    
    subgraph "Data Layer"
        F[MongoDB Atlas<br/>Shared Database]
    end
    
    D1 -->|loads| A
    D2 -->|loads| A
    D3 -->|loads| A
    
    A --> B
    B --> C
    
    C -->|reads VITE_TENANT_ID| D1
    C -->|reads VITE_TENANT_ID| D2
    C -->|reads VITE_TENANT_ID| D3
    
    D1 -->|API calls| E1
    D2 -->|API calls| E2
    D3 -->|API calls| E3
    
    E1 -->|queries| F
    E2 -->|queries| F
    E3 -->|queries| F
