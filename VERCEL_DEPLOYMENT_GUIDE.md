# Vercel Deployment Guide - File Storage

## ⚠️ Critical Issue

**Vercel/Railway/Render have ephemeral filesystems:**
- Files uploaded to `uploads/` folder will be **deleted** when app restarts
- Need **persistent storage** solution for production

## ✅ Solution Options

### Option 1: Use Backend with Persistent Storage (Recommended)

**Best for:** Railway or Render backend deployment

#### Railway Backend:
1. Add a **Volume** to your Railway project
2. Mount to `/uploads` directory
3. Files persist across restarts

```bash
# Railway CLI
railway volume add uploads
railway volume mount uploads /uploads
```

#### Render Backend:
1. Add a **Persistent Disk**
2. Mount to `/uploads` directory
3. Files persist across restarts

**Configuration:**
```yaml
# render.yaml
services:
  - type: web
    name: hrms-backend
    env: java
    buildCommand: ./mvnw clean package
    startCommand: java -jar target/*.jar
    disk:
      name: uploads
      mountPath: /uploads
      sizeGB: 1
```

---

### Option 2: Use Cloudinary (Free Tier)

**Best for:** Any deployment (Vercel/Railway/Render)

Cloudinary provides free cloud storage with API.

#### Step 1: Create Cloudinary Account
```
Go to: https://cloudinary.com
Sign up (Free tier: 25GB storage, 25GB bandwidth/month)
Get your credentials:
- Cloud Name
- API Key
- API Secret
```

#### Step 2: Add Cloudinary Dependency

**File: `HRMS-Backend/pom.xml`**
```xml
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.36.0</version>
</dependency>
```

#### Step 3: Add Configuration

**File: `src/main/resources/application.properties`**
```properties
# Cloudinary Configuration
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME:your-cloud-name}
cloudinary.api-key=${CLOUDINARY_API_KEY:your-api-key}
cloudinary.api-secret=${CLOUDINARY_API_SECRET:your-api-secret}
```

#### Step 4: Create CloudinaryService

**File: `src/main/java/.../service/CloudinaryService.java`**
```java
package com.omoikaneinnovation.hmrsbackend.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(
        @Value("${cloudinary.cloud-name}") String cloudName,
        @Value("${cloudinary.api-key}") String apiKey,
        @Value("${cloudinary.api-secret}") String apiSecret
    ) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
            "cloud_name", cloudName,
            "api_key", apiKey,
            "api_secret", apiSecret
        ));
    }

    public String uploadFile(MultipartFile file) throws IOException {
        Map uploadResult = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap(
                "resource_type", "auto",
                "folder", "hrms/documents"
            )
        );
        
        return (String) uploadResult.get("secure_url");
    }
}
```

#### Step 5: Update FileController to Use Cloudinary

**File: `HRMS-Backend/.../controller/FileController.java`**
```java
@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = {"http://localhost:*", "https://*.vercel.app"})
public class FileController {

    private final CloudinaryService cloudinaryService;
    private static final String UPLOAD_DIR = "uploads/tasks/";
    
    @Value("${spring.profiles.active:dev}")
    private String activeProfile;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl;
            
            // Use Cloudinary in production, local storage in development
            if ("prod".equals(activeProfile)) {
                // Production: Use Cloudinary
                fileUrl = cloudinaryService.uploadFile(file);
                System.out.println("☁️ File uploaded to Cloudinary: " + fileUrl);
            } else {
                // Development: Use local storage
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                String uniqueFilename = UUID.randomUUID().toString() 
                    + file.getOriginalFilename().substring(
                        file.getOriginalFilename().lastIndexOf(".")
                    );
                
                Path filePath = uploadPath.resolve(uniqueFilename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                fileUrl = "/uploads/tasks/" + uniqueFilename;
                System.out.println("💾 File saved locally: " + filePath.toAbsolutePath());
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            response.put("fileName", file.getOriginalFilename());
            response.put("message", "File uploaded successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("❌ File upload error: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
```

#### Step 6: Update BGV.jsx for Cloudinary URLs

**File: `HRMS-Frontend/src/Pages/BGV.jsx`**
```javascript
const getDocumentUrl = (docPath) => {
  if (!docPath || docPath === 'N/A') return null;
  
  // If it's a full URL (Cloudinary), return as-is
  if (docPath.startsWith('http://') || docPath.startsWith('https://')) {
    return docPath;  // ✅ Cloudinary URLs are complete
  }
  
  // If it's a base64 data URL, return as-is
  if (docPath.startsWith('data:')) {
    return docPath;
  }
  
  // If it's just a filename
  if (!docPath.includes('/') && !docPath.startsWith('http')) {
    console.warn('⚠️ Document is just a filename:', docPath);
    return null;
  }
  
  // For local development paths
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';
  
  if (docPath.startsWith('/uploads/')) {
    return `${baseUrl}${docPath}`;
  }
  
  if (docPath.startsWith('uploads/')) {
    return `${baseUrl}/${docPath}`;
  }
  
  const cleanPath = docPath.startsWith('/') ? docPath.substring(1) : docPath;
  return `${baseUrl}/uploads/${cleanPath}`;
};
```

#### Step 7: Set Environment Variables

**Vercel (Frontend):**
```bash
# Vercel Dashboard → Your Project → Settings → Environment Variables
VITE_API_BASE_URL=https://your-backend.railway.app
```

**Railway/Render (Backend):**
```bash
# Railway/Render Dashboard → Environment Variables
SPRING_PROFILES_ACTIVE=prod
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

### Option 3: AWS S3 (For Large Scale)

**Best for:** High traffic production apps

#### Dependencies:
```xml
<dependency>
    <groupId>com.amazonaws</groupId>
    <artifactId>aws-java-sdk-s3</artifactId>
    <version>1.12.529</version>
</dependency>
```

#### Configuration:
```properties
aws.s3.bucket-name=${AWS_S3_BUCKET_NAME}
aws.s3.region=${AWS_REGION:us-east-1}
aws.access-key-id=${AWS_ACCESS_KEY_ID}
aws.secret-access-key=${AWS_SECRET_ACCESS_KEY}
```

*(Full S3 implementation available on request)*

---

## 📊 Comparison

| Solution | Cost | Setup Complexity | Best For |
|----------|------|------------------|----------|
| Railway Volume | Free tier | Low | Railway backend |
| Render Disk | $0.25/GB/mo | Low | Render backend |
| Cloudinary | Free tier | Medium | Any deployment |
| AWS S3 | $0.023/GB/mo | High | Large scale |

---

## 🚀 Recommended Setup

### For Your Project:

**Option 1 (Easiest):** Railway Backend + Volume
```
✅ No code changes needed
✅ Files persist across restarts
✅ Free tier available
✅ Easy to set up
```

**Option 2 (Most Flexible):** Cloudinary
```
✅ Works with any hosting
✅ CDN included
✅ Free tier generous
✅ Requires code changes (provided above)
```

---

## 🧪 Testing Deployment

### Step 1: Deploy Backend (Railway)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Create project
railway init

# Add volume
railway volume add uploads

# Deploy
railway up
```

### Step 2: Configure Environment Variables

**Backend (Railway):**
```
SPRING_PROFILES_ACTIVE=prod
UPLOAD_DIR=/uploads/tasks/
```

**Frontend (Vercel):**
```
VITE_API_BASE_URL=https://hrms-backend-production.up.railway.app
```

### Step 3: Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd HRMS-Frontend
vercel --prod
```

### Step 4: Test File Upload & Viewing

1. Go to deployed frontend: `https://your-app.vercel.app/onboarding`
2. Upload documents
3. Check BGV page
4. Click "View File"
5. ✅ Should work!

---

## ⚠️ Important Notes

### For Railway/Render:

**✅ DO:**
- Add persistent volume/disk
- Set correct environment variables
- Test file persistence after restart

**❌ DON'T:**
- Use local filesystem without volume
- Forget to mount volume to `/uploads`
- Skip environment variable configuration

### For Cloudinary:

**✅ DO:**
- Keep API secret secure
- Use environment variables
- Test with small files first

**❌ DON'T:**
- Hardcode credentials in code
- Commit .env files to git
- Exceed free tier limits without monitoring

---

## 🐛 Troubleshooting Deployment

### Issue: Files disappear after restart

**Cause:** No persistent storage configured

**Solution:** Add Railway volume or use Cloudinary

### Issue: 404 on file access after deployment

**Cause:** Frontend using wrong backend URL

**Solution:** Check `VITE_API_BASE_URL` environment variable

### Issue: CORS error in production

**Cause:** Backend not allowing Vercel domain

**Solution:** Update `@CrossOrigin`:
```java
@CrossOrigin(originPatterns = {
    "http://localhost:*",
    "https://*.vercel.app",
    "https://your-domain.com"
})
```

### Issue: Upload works but view fails

**Cause:** File URL in database is relative, not absolute

**Solution:** 
- For Cloudinary: Returns full URL automatically
- For Railway: Ensure frontend uses correct `VITE_API_BASE_URL`

---

## ✅ Deployment Checklist

### Backend (Railway/Render):
- [ ] Persistent volume/disk configured
- [ ] Environment variables set
- [ ] CORS allows Vercel domain
- [ ] Upload endpoint accessible
- [ ] Files persist after restart

### Frontend (Vercel):
- [ ] `VITE_API_BASE_URL` set correctly
- [ ] Build succeeds
- [ ] Can access backend API
- [ ] File upload works
- [ ] File viewing works

### Testing:
- [ ] Upload document in production
- [ ] Document appears in BGV
- [ ] Click "View File" works
- [ ] Restart backend
- [ ] Documents still accessible (if using volume/Cloudinary)

---

## 📞 Quick Setup Commands

### Railway Backend (with Volume):
```bash
railway login
railway init
railway volume add uploads --mount /uploads
railway up
railway open
```

### Vercel Frontend:
```bash
cd HRMS-Frontend
vercel --prod
```

### Set Environment Variables:
```bash
# Railway
railway variables set SPRING_PROFILES_ACTIVE=prod

# Vercel
vercel env add VITE_API_BASE_URL production
```

---

## 🎯 Final Answer

**Yes, it will work in Vercel deployment IF:**

1. **Backend has persistent storage** (Railway Volume / Render Disk)
   - OR -
2. **Using cloud storage** (Cloudinary / S3)

**Without persistent storage, files will be lost on backend restart.**

**Recommended:** Use Railway backend with Volume (easiest) or add Cloudinary (most flexible).

Need help implementing Cloudinary? I can provide the complete code!
