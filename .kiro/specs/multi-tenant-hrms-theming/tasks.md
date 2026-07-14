# Implementation Plan: Multi-Tenant HRMS Theming System

## Overview

This implementation plan transforms the existing single-tenant HRMS application into a multi-tenant system supporting unique branding for three companies (TalentHub Solutions, WorkForce Pro, PeopleSync Enterprise) while maintaining a single codebase. The implementation copies the existing HRMSBackend repository to a new repository (-HRMS-MultiCompany) and adds a theme engine without modifying core business logic.

**Key Technical Details:**
- Frontend: React 19 + Vite with JavaScript
- Backend: Spring Boot 3.2.5 with Java 21
- Database: MongoDB Atlas (shared across all tenants)
- Deployment: 3 Vercel instances (frontend) + 3 Render instances (backend)

## Tasks

- [x] 1. Repository setup and code migration
  - Create new GitHub repository named "HRMS-MultiCompany"
  - Copy all code from HRMSBackend repository to new repository
  - Preserve git history using `git clone --mirror` approach
  - Update README.md with multi-tenant architecture overview
  - Initialize git repository and push to GitHub
  - Verify all frontend and backend code copied successfully
  - _Requirements: 6.1-6.7, 12.1-12.2_

- [x] 2. Create theme configuration system
  - [x] 2.1 Create theme configuration JSON structure
    - Create directory: `HRMS-Frontend/src/config/themes/`
    - Create `company-a.json` with TalentHub Solutions branding (name: "TalentHub Solutions", primary: #1E40AF, secondary: #3B82F6, accent: #DBEAFE, initials: "TH")
    - Create `company-b.json` with WorkForce Pro branding (name: "WorkForce Pro", primary: #047857, secondary: #10B981, accent: #D1FAE5, initials: "WP")
    - Create `company-c.json` with PeopleSync Enterprise branding (name: "PeopleSync Enterprise", primary: #5B21B6, secondary: #8B5CF6, accent: #EDE9FE, initials: "PS")
    - Include properties: companyName, colors (primary, secondary, accent, text, background, border, hover, active, disabled), logos (navigationLogo, loginLogo, faviconPath), initials
    - _Requirements: 1.1-1.7, 11.1-11.7_

  - [x] 2.2 Create theme loader utility
    - Create `HRMS-Frontend/src/utils/themeLoader.js`
    - Implement `loadThemeConfig(tenantId)` function that reads VITE_TENANT_ID from environment
    - Load corresponding theme JSON file based on tenantId
    - Implement fallback to default configuration with console warning for invalid tenantId
    - Add JSON validation for required properties
    - Export theme configuration object
    - _Requirements: 1.1-1.7, 10.1-10.8, 11.6_

  - [x] 2.3 Create Theme Context Provider
    - Create `HRMS-Frontend/src/context/ThemeContext.jsx`
    - Implement React Context for theme configuration
    - Load theme on application initialization using themeLoader utility
    - Provide theme configuration to all child components
    - Store theme in context state for session persistence
    - _Requirements: 1.5-1.6, 8.1-8.8_

- [-] 3. Implement CSS custom properties system
  - [x] 3.1 Create base CSS architecture
    - Create `HRMS-Frontend/src/styles/base.css` with layout, typography, and spacing rules common to all tenants
    - Define CSS custom property placeholders: --primary-color, --secondary-color, --accent-color, --text-color, --background-color, --border-color, --hover-color, --active-color, --disabled-color
    - Import base.css in main App.jsx
    - _Requirements: 16.5-16.7_

  - [x] 3.2 Create CSS injection utility
    - Create `HRMS-Frontend/src/utils/cssInjector.js`
    - Implement `injectThemeColors(themeConfig)` function
    - Dynamically set CSS custom properties on document root using theme configuration colors
    - Calculate hover colors (darken by 10% luminosity) and active colors (darken by 15% luminosity)
    - _Requirements: 16.1-16.4, 9.8-9.9_

  - [ ] 3.3 Update ThemeContext to inject CSS properties
    - Call cssInjector when theme loads
    - Apply CSS custom properties to document.documentElement.style
    - _Requirements: 16.2_

- [x] 4. Create initial logo generation system
  - [x] 4.1 Create InitialLogo component
    - Create `HRMS-Frontend/src/components/InitialLogo.jsx`
    - Accept props: initials, backgroundColor, size (48px or 120px)
    - Render square div with initials in white text, sans-serif font weight 600
    - Support different sizes for navigation (48x48) and login (120x120)
    - _Requirements: 2.1-2.6_

  - [x] 4.2 Create LogoManager component
    - Create `HRMS-Frontend/src/components/LogoManager.jsx`
    - Accept props: logoPath, fallbackInitials, backgroundColor, size
    - Attempt to load logo image from logoPath
    - On load error, render InitialLogo component as fallback
    - Log warning when logo file is missing
    - Add alt text using company name from theme
    - _Requirements: 2.7, 17.7, 18.4-18.5_

- [x] 5. Setup logo asset directory structure
  - Create directory: `HRMS-Frontend/public/logos/company-a/`
  - Create directory: `HRMS-Frontend/public/logos/company-b/`
  - Create directory: `HRMS-Frontend/public/logos/company-c/`
  - Create placeholder README.md in each directory explaining logo file requirements (PNG/SVG, dimensions, file size limits)
  - Update theme JSON files to reference logo paths: `/logos/company-a/logo.png`, etc.
  - _Requirements: 17.1-17.8_

- [ ] 6. Integrate theme system into existing components
  - [ ] 6.1 Update navigation header component
    - Locate main navigation/header component (likely `HRMS-Frontend/src/components/Navbar.jsx` or similar)
    - Replace hard-coded colors with CSS custom properties (var(--primary-color), etc.)
    - Add LogoManager component for navigation logo (48x48 size)
    - Display company name from theme context next to logo
    - Ensure responsive behavior on mobile (hamburger menu)
    - _Requirements: 8.1, 16.4, 20.2, 4.4_

  - [ ] 6.2 Update login screen component
    - Locate login component (likely `HRMS-Frontend/src/pages/Login.jsx` or similar)
    - Replace hard-coded colors with CSS custom properties
    - Add LogoManager component for login logo (120x120 size)
    - Display company name from theme context above login form
    - Update browser tab title with company name
    - _Requirements: 8.1, 20.1, 20.3_

  - [ ] 6.3 Update button components
    - Locate button components across the application
    - Replace hard-coded background colors with var(--primary-color) for primary buttons
    - Replace hard-coded background colors with var(--secondary-color) for secondary buttons
    - Use var(--hover-color) for hover states and var(--active-color) for active states
    - _Requirements: 8.2, 9.4-9.5, 16.4_

  - [ ] 6.4 Update page footer component
    - Locate footer component
    - Display company name from theme context
    - Replace colors with CSS custom properties
    - _Requirements: 20.5_

  - [ ] 6.5 Update global styles for theming
    - Search for hard-coded color values (#hex codes, rgb(), etc.) in all CSS/SCSS files
    - Replace with appropriate CSS custom properties
    - Focus on backgrounds, borders, text colors, links
    - _Requirements: 8.2, 16.4_

- [ ] 7. Checkpoint - Theme system functional verification
  - Test theme switching by changing VITE_TENANT_ID locally
  - Verify CSS custom properties are applied correctly
  - Verify InitialLogo displays for all three companies
  - Verify company names appear in header, login, and footer
  - Ensure all tests pass, ask the user if questions arise
  - _Requirements: 1.1-1.7, 2.1-2.6, 20.1-20.5_

- [ ] 8. Implement responsive design compliance
  - [ ] 8.1 Create responsive breakpoint constants
    - Create `HRMS-Frontend/src/constants/breakpoints.js`
    - Define breakpoints: mobile (< 768px), tablet (768-1024px), desktop (> 1024px)
    - _Requirements: 4.1-4.3_

  - [ ] 8.2 Update navigation for mobile responsiveness
    - Implement collapsible hamburger menu for viewport < 768px
    - Ensure touch targets are minimum 44x44 pixels on mobile
    - Test orientation changes respond within 300ms
    - _Requirements: 4.4, 4.6, 4.8_

  - [ ] 8.3 Update data tables for responsive display
    - Add horizontal scrolling for tables on mobile when columns exceed viewport
    - Ensure responsive behavior is consistent across all three tenant themes
    - _Requirements: 4.5, 4.7_

  - [ ] 8.4 Implement responsive logo loading
    - Load mobile-optimized logos (max 48px width) when viewport < 768px
    - Load desktop-optimized logos (max 120px width) when viewport >= 768px
    - Implement lazy loading for logos below viewport
    - Set browser cache duration to 7 days for logo assets
    - _Requirements: 18.1-18.6_

- [x] 9. Setup environment variable configuration
  - [x] 9.1 Create environment files for local development
    - Create `HRMS-Frontend/.env.company-a` with VITE_TENANT_ID=company-a
    - Create `HRMS-Frontend/.env.company-b` with VITE_TENANT_ID=company-b
    - Create `HRMS-Frontend/.env.company-c` with VITE_TENANT_ID=company-c
    - Include VITE_API_BASE_URL, VITE_API_URL, VITE_WS_URL placeholders
    - _Requirements: 10.1-10.8_

  - [x] 9.2 Update package.json scripts
    - Add npm scripts: `"dev:company-a": "vite --mode company-a"`
    - Add npm scripts: `"dev:company-b": "vite --mode company-b"`
    - Add npm scripts: `"dev:company-c": "vite --mode company-c"`
    - Add build scripts for each company
    - _Requirements: 10.1-10.2_

  - [x] 9.3 Create deployment environment documentation
    - Create `DEPLOYMENT_GUIDE.md` in repository root
    - Document all required environment variables for each deployment instance
    - Include Vercel and Render configuration steps
    - _Requirements: 10.8, 14.1-14.7, 15.1-15.8_

- [ ] 10. Verify business logic preservation
  - [ ] 10.1 Create business logic test checklist
    - Create `TESTING_CHECKLIST.md` listing all core features to verify
    - Include: authentication, employee management, attendance, leave, payroll, recruitment, performance, tasks, internal jobs, notifications, chat/call, profile
    - _Requirements: 6.1-6.14_

  - [ ]* 10.2 Write integration tests for authentication
    - Test login, logout, password recovery work identically for all three tenants
    - Verify authentication tokens and session management unchanged
    - _Requirements: 6.1_

  - [ ]* 10.3 Write integration tests for employee management
    - Test CRUD operations work identically for all three tenants
    - Verify API endpoints unchanged
    - _Requirements: 6.2, 6.13_

  - [ ]* 10.4 Write integration tests for real-time features
    - Test chat and LiveKit call features work for all tenants
    - Verify WebSocket connections preserved
    - _Requirements: 6.11, 8.6_

- [ ] 11. Checkpoint - Business logic verification complete
  - Run all integration tests
  - Manually test core features with different tenant configurations
  - Verify database schema and collections unchanged
  - Ensure all tests pass, ask the user if questions arise
  - _Requirements: 6.1-6.14, 7.2-7.3_

- [ ] 12. Deploy backend to Render (3 instances)
  - [ ] 12.1 Create Render service for Company A backend
    - Login to Render dashboard
    - Create new Web Service from GitHub repository
    - Name: "hrms-backend-company-a"
    - Set build command: `mvn clean package -DskipTests`
    - Set start command: `java -jar target/hmrs-backend-0.0.1-SNAPSHOT.jar`
    - Set environment variables: MONGODB_URI (shared database), SPRING_PROFILES_ACTIVE=prod
    - Deploy and verify startup
    - _Requirements: 5.1-5.3, 7.1, 7.4-7.5_

  - [ ] 12.2 Create Render service for Company B backend
    - Repeat same steps as 12.1
    - Name: "hrms-backend-company-b"
    - Use same MONGODB_URI (shared database)
    - Deploy and verify startup
    - _Requirements: 5.1-5.3, 7.1, 7.4-7.5_

  - [ ] 12.3 Create Render service for Company C backend
    - Repeat same steps as 12.1
    - Name: "hrms-backend-company-c"
    - Use same MONGODB_URI (shared database)
    - Deploy and verify startup
    - _Requirements: 5.1-5.3, 7.1, 7.4-7.5_

- [ ] 13. Deploy frontend to Vercel (3 instances)
  - [ ] 13.1 Create Vercel project for Company A frontend
    - Login to Vercel dashboard
    - Import GitHub repository
    - Create new project: "hrms-frontend-company-a"
    - Set root directory: `HRMS-Frontend`
    - Set framework preset: Vite
    - Set environment variables:
      - VITE_TENANT_ID=company-a
      - VITE_API_BASE_URL=[Company A Render backend URL]
      - VITE_API_URL=[Company A Render backend URL]/api
      - VITE_WS_URL=[Company A Render backend WebSocket URL]
    - Deploy and verify theme loads correctly
    - _Requirements: 5.1-5.8, 10.3, 15.1-15.8_

  - [ ] 13.2 Create Vercel project for Company B frontend
    - Repeat same steps as 13.1
    - Project name: "hrms-frontend-company-b"
    - Set VITE_TENANT_ID=company-b
    - Point API URLs to Company B Render backend
    - Deploy and verify
    - _Requirements: 5.1-5.8, 10.4, 15.1-15.8_

  - [ ] 13.3 Create Vercel project for Company C frontend
    - Repeat same steps as 13.1
    - Project name: "hrms-frontend-company-c"
    - Set VITE_TENANT_ID=company-c
    - Point API URLs to Company C Render backend
    - Deploy and verify
    - _Requirements: 5.1-5.8, 10.5, 15.1-15.8_

- [ ] 14. Post-deployment testing and verification
  - [ ] 14.1 Test Company A deployment end-to-end
    - Open Company A Vercel URL in browser
    - Verify TalentHub Solutions branding (blue theme, "TH" logo, company name)
    - Test login with existing user credentials
    - Verify all core features work (navigation, data display, forms)
    - Test on mobile, tablet, and desktop devices
    - _Requirements: 1.2, 4.1-4.8, 20.1-20.5_

  - [ ] 14.2 Test Company B deployment end-to-end
    - Open Company B Vercel URL in browser
    - Verify WorkForce Pro branding (green theme, "WP" logo, company name)
    - Test login with existing user credentials
    - Verify all core features work
    - Test on mobile, tablet, and desktop devices
    - _Requirements: 1.3, 4.1-4.8, 20.1-20.5_

  - [ ] 14.3 Test Company C deployment end-to-end
    - Open Company C Vercel URL in browser
    - Verify PeopleSync Enterprise branding (purple theme, "PS" logo, company name)
    - Test login with existing user credentials
    - Verify all core features work
    - Test on mobile, tablet, and desktop devices
    - _Requirements: 1.4, 4.1-4.8, 20.1-20.5_

  - [ ] 14.4 Verify database isolation
    - Confirm all three deployments connect to same MongoDB Atlas database
    - Verify data is shared across all tenant instances
    - Confirm no tenant-specific data isolation (all use same collections)
    - _Requirements: 7.1-7.6_

  - [ ] 14.5 Verify deployment independence
    - Make a test change to Company A environment variables on Vercel
    - Verify Company B and Company C are unaffected
    - Confirm environment isolation working correctly
    - _Requirements: 15.8_

- [ ] 15. Checkpoint - All deployments verified
  - Confirm all 6 deployments (3 frontend + 3 backend) are live and functional
  - Verify each tenant displays correct branding
  - Verify business logic works identically across all tenants
  - Ensure all tests pass, ask the user if questions arise
  - _Requirements: 5.1-5.8, 6.1-6.14_

- [-] 16. Create post-deployment customization guide
  - [x] 16.1 Create CUSTOMIZATION_GUIDE.md
    - Document how to update company names in theme JSON files
    - Document how to update color schemes (with example hex codes and WCAG contrast guidance)
    - Document how to replace InitialLogo with client-provided logo files
    - Include required logo file formats (PNG/SVG), dimensions, and file size limits
    - Document logo file naming and directory structure
    - _Requirements: 3.1-3.7, 14.1-14.3, 17.8_

  - [ ] 16.2 Add deployment update procedures
    - Document how to update theme configuration on Vercel (trigger rebuild)
    - Document how to update environment variables without full redeploy
    - Include Vercel CLI commands for quick updates
    - Include Render dashboard steps for backend configuration changes
    - _Requirements: 14.4_

  - [ ] 16.3 Add testing procedures
    - Document how to test branding changes locally before deployment
    - Include mobile, tablet, desktop testing checklist
    - Document visual regression testing approach
    - Include steps to verify business logic unchanged after branding updates
    - _Requirements: 14.5-14.6_

  - [ ] 16.4 Add troubleshooting section
    - Document common errors: missing logo files, invalid color codes, malformed JSON
    - Include solutions for theme not loading, CSS properties not applying
    - Add Vercel build error debugging steps
    - Add Render deployment error debugging steps
    - _Requirements: 14.7_

- [ ] 17. Implement theme consistency validation tools
  - [ ] 17.1 Create theme inspector development tool
    - Create `HRMS-Frontend/src/utils/themeInspector.js`
    - Implement highlight mode that shows all themed elements
    - Display which CSS custom properties applied to each element
    - Activate with keyboard shortcut in development mode only
    - _Requirements: 19.1-19.2_

  - [ ]* 17.2 Add theme validation logging
    - Log console warnings when hard-coded colors detected instead of CSS custom properties
    - Create validation report identifying non-themed elements
    - _Requirements: 19.3, 19.5_

  - [ ] 17.3 Create visual verification checklist
    - Create `THEME_VERIFICATION_CHECKLIST.md`
    - List all pages and components requiring visual verification per tenant
    - Include screenshots placeholders for before/after comparison
    - _Requirements: 19.6_

- [ ] 18. Implement future tenant scalability features
  - [ ] 18.1 Refactor theme loading to use mapping configuration
    - Create `HRMS-Frontend/src/config/tenantMapping.js`
    - Map tenant IDs to theme configuration file paths
    - Remove hard-coded switch statements or if-else chains
    - Update themeLoader to use mapping approach
    - _Requirements: 13.1-13.5_

  - [ ] 18.2 Create "Add New Tenant" documentation
    - Create `ADD_NEW_TENANT_GUIDE.md`
    - Provide step-by-step process for adding Company D, E, F
    - Include theme JSON template
    - Include environment variable template
    - Include deployment checklist for new tenant
    - _Requirements: 13.6_

- [-] 19. Final integration and wiring
  - [x] 19.1 Update App.jsx to use ThemeContext
    - Wrap application with ThemeProvider
    - Ensure theme loads before rendering UI
    - Add loading state while theme initializes
    - _Requirements: 1.1-1.7, 8.1-8.8_

  - [ ] 19.2 Update email templates with company name
    - Locate email template files in backend
    - Add company name placeholder to email headers
    - Ensure backend can access tenant configuration (or pass company name via API)
    - _Requirements: 20.4_

  - [ ] 19.3 Update document headers with company name
    - Locate PDF generation code for reports and exports
    - Add company name to document headers
    - _Requirements: 20.6_

  - [ ] 19.4 Implement company name truncation
    - Add CSS for company name display with max-width
    - Truncate with ellipsis when name exceeds 30 characters
    - Show full name on hover with title attribute
    - _Requirements: 20.7_

- [ ] 20. Final checkpoint - Complete system verification
  - Run full test suite across all three tenant configurations
  - Verify all deployment URLs accessible and properly branded
  - Verify shared database functioning correctly
  - Test feature parity across all tenants (same functionality, different branding)
  - Verify responsive design on multiple devices for all tenants
  - Verify all documentation complete and accurate
  - Ensure all tests pass, ask the user if questions arise
  - _Requirements: ALL_

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at critical milestones
- The implementation maintains complete separation between visual theming and business logic
- All three tenants share the same MongoDB Atlas database and identical API contracts
- Future tenants can be added by creating new theme JSON files and deployment configurations
- Logo assets start as initial-based placeholders and can be replaced with client-provided files later

## Key Success Criteria

1. **Single Codebase**: All three tenant deployments use the same source code
2. **Visual Isolation**: Each tenant displays unique branding (colors, logos, company names)
3. **Business Logic Preservation**: All core HRMS features work identically across tenants
4. **Scalability**: New tenants can be added through configuration only
5. **Maintainability**: Bug fixes and features apply to all tenants automatically
6. **Responsive Design**: All tenants work seamlessly on mobile, tablet, and desktop
7. **Documentation**: Complete guides for customization, deployment, and troubleshooting

## Deployment URLs (To Be Determined)

After deployment, document the live URLs:

- **Company A (TalentHub Solutions)**
  - Frontend: [Vercel URL]
  - Backend: [Render URL]

- **Company B (WorkForce Pro)**
  - Frontend: [Vercel URL]
  - Backend: [Render URL]

- **Company C (PeopleSync Enterprise)**
  - Frontend: [Vercel URL]
  - Backend: [Render URL]
