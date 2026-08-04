# Complete Cloudinary Setup (Works in Vercel)

## ✅ Why Cloudinary?

- ✅ Works with ANY hosting (Vercel, Railway, Render)
- ✅ Files persist forever (not deleted on restart)
- ✅ Free tier: 25GB storage + 25GB bandwidth/month
- ✅ CDN included (fast global delivery)
- ✅ No server storage needed

---

## 🚀 Step-by-Step Setup (15 minutes)

### Step 1: Create Cloudinary Account (2 min)

1. Go to: https://cloudinary.com/users/register/free
2. Sign up with email
3. After login, go to Dashboard
4. Copy these 3 values:
   ```
   Cloud Name: your-cloud-name
   API Key: 123456789012345
   API Secret: abcdefghijklmnopqrstuvwxyz
   ```

---

### Step 2: Add Cloudinary Dependency (1 min)

**File: `HRMS-Backend/pom.xml`**

Add this inside `<dependencies>` section:

```xml
<!-- Cloudinary for file storage -->
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.36.0</version>
</dependency>
```

Then run:
```bash
cd HRMS-Backend
./mvnw clean install
```

---

### Step 3: Add Configuration (1 min)

**File: `src/main/resources/application.properties`**

Add these lines at the end:

```properties
# Cloudinary Configuration
cloudinary.enabled=${CLOUDINARY_ENABLED:false}
cloudinary.cloud-name=${CLOUDINARY_CLOUD_NAME:}
cloudinary.api-key=${CLOUDINARY_API_KEY:}
cloudinary.api-secret=${CLOUDINARY_API_SECRET:}
```

---

### Step 4: Create CloudinaryService (3 min)

**File: `src/main/java/com/omoikaneinnovation/hmrsbackend/service/CloudinaryService.java`**

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
    private final boolean enabled;

    public CloudinaryService(
        @Value("${cloudinary.enabled:false}") boolean enabled,
        @Value("${cloudinary.cloud-name:}") String cloudName,
        @Value("${cloudinary.api-key:}") String apiKey,
        @Value("${cloudinary.api-secret:}") String apiSecret
    ) {
        this.enabled = enabled;
        
        if (enabled && cloudName != null && !cloudName.isEmpty()) {
            this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
            ));
            System.out.println("☁️ Cloudinary enabled: " + cloudName);
        } else {
            this.cloudinary = null;
            System.out.println("💾 Cloudinary disabled, using local storage");
        }
    }

    public boolean isEnabled() {
        return enabled && cloudinary != null;
    }

    public String uploadFile(MultipartFile file) throws IOException {
        if (!isEnabled()) {
            throw new IllegalStateException("Cloudinary is not enabled");
        }
        
        System.out.println("☁️ Uploading to Cloudinary: " + file.getOriginalFilename());
        
        Map uploadResult = cloudinary.uploader().upload(
            file.getBytes(),
            ObjectUtils.asMap(
                "resource_type", "auto",
                "folder", "hrms/documents",
                "use_filename", true,
                "unique_filename", true
            )
        );
        
        String secureUrl = (String) uploadResult.get("secure_url");
        System.out.println("✅ Cloudinary URL: " + secureUrl);
        
        return secureUrl;
    }
}
```

---

### Step 5: Update FileController (5 min)

**File: `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/controller/FileController.java`**

Replace the entire file with this:

```java
package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = {"http://localhost:*", "http://127.0.0.1:*", "https://*.vercel.app"})
public class FileController {

    private final CloudinaryService cloudinaryService;
    private static final String UPLOAD_DIR = "uploads/tasks/";

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("📤 File upload request: " + file.getOriginalFilename());
            
            String fileUrl;
            
            // Use Cloudinary if enabled, otherwise local storage
            if (cloudinaryService.isEnabled()) {
                // ☁️ Production: Upload to Cloudinary
                fileUrl = cloudinaryService.uploadFile(file);
                System.out.println("☁️ Stored in Cloudinary");
            } else {
                // 💾 Development: Save to local disk
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                
                String originalFilename = file.getOriginalFilename();
                String fileExtension = originalFilename != null && originalFilename.contains(".")
                        ? originalFilename.substring(originalFilename.lastIndexOf("."))
                        : "";
                String uniqueFilename = UUID.randomUUID().toString() + fileExtension;
                
                Path filePath = uploadPath.resolve(uniqueFilename);
                Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
                
                fileUrl = "/uploads/tasks/" + uniqueFilename;
                System.out.println("💾 Stored locally: " + filePath.toAbsolutePath());
            }
            
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", fileUrl);
            response.put("fileName", file.getOriginalFilename());
            response.put("message", "File uploaded successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            System.err.println("❌ Upload failed: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    @GetMapping("/test-upload")
    public ResponseEntity<Map<String, Object>> testUploadDirectory() {
        Map<String, Object> response = new HashMap<>();
        
        response.put("cloudinaryEnabled", cloudinaryService.isEnabled());
        
        if (!cloudinaryService.isEnabled()) {
            try {
                Path uploadPath = Paths.get(UPLOAD_DIR);
                response.put("uploadDirectory", uploadPath.toAbsolutePath().toString());
                response.put("directoryExists", Files.exists(uploadPath));
                
                if (Files.exists(uploadPath)) {
                    long fileCount = Files.list(uploadPath).count();
                    response.put("fileCount", fileCount);
                }
            } catch (IOException e) {
                response.put("error", e.getMessage());
            }
        }
        
        return ResponseEntity.ok(response);
    }
}
```

---

### Step 6: Test Locally First (2 min)

**Without Cloudinary (local storage):**

```bash
cd HRMS-Backend
./mvnw spring-boot:run
```

Should see:
```
💾 Cloudinary disabled, using local storage
```

Test upload → Should save to `uploads/tasks/` folder ✅

---

**With Cloudinary (cloud storage):**

Add to `HRMS-Backend/src/main/resources/application.properties`:

```properties
cloudinary.enabled=true
cloudinary.cloud-name=your-cloud-name
cloudinary.api-key=123456789012345
cloudinary.api-secret=abcdefghijklmnopqrstuvwxyz
```

Restart backend:
```bash
./mvnw spring-boot:run
```

Should see:
```
☁️ Cloudinary enabled: your-cloud-name
```

Test upload → Should upload to Cloudinary ✅

Check Cloudinary Dashboard → Media Library → Should see uploaded file

---

### Step 7: Deploy to Production (5 min)

#### Backend (Railway/Render)

**Set Environment Variables:**

```bash
CLOUDINARY_ENABLED=true
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

**Railway:**
```bash
railway variables set CLOUDINARY_ENABLED=true
railway variables set CLOUDINARY_CLOUD_NAME=your-cloud-name
railway variables set CLOUDINARY_API_KEY=123456789012345
railway variables set CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
railway up
```

**Render:**
Go to Dashboard → Environment → Add variables → Save → Redeploy

#### Frontend (Vercel)

**Set Environment Variable:**

```bash
VITE_API_BASE_URL=https://your-backend.railway.app
```

**Vercel:**
```bash
vercel env add VITE_API_BASE_URL production
# Enter: https://your-backend.railway.app
vercel --prod
```

---

## ✅ Verification

### Local Testing:

1. Restart backend
2. Check logs:
   - ☁️ Cloudinary enabled: ... ✅
3. Upload a document via Onboarding
4. Check logs:
   - ☁️ Uploading to Cloudinary: ...
   - ✅ Cloudinary URL: https://res.cloudinary.com/...
5. Go to BGV page → Click "View File"
6. Document should open (Cloudinary URL) ✅
7. Check Cloudinary Dashboard → Media Library
8. Uploaded file should appear ✅

### Production Testing:

1. Deploy to Vercel/Railway
2. Go to deployed app
3. Upload a document
4. Check it appears in Cloudinary Dashboard
5. View file from BGV page
6. Should open (from Cloudinary CDN) ✅
7. **Restart backend**
8. Check document is still viewable ✅

---

## 🎯 Benefits

### Development:
- ✅ Uses local storage (fast, no internet needed)
- ✅ No Cloudinary credentials required
- ✅ Files in `uploads/tasks/` folder

### Production:
- ✅ Uses Cloudinary (persistent, reliable)
- ✅ Files survive backend restarts
- ✅ Fast CDN delivery worldwide
- ✅ No disk space issues

---

## 🐛 Troubleshooting

### Issue: "Cloudinary disabled" in production

**Check:** Environment variables are set:
```bash
railway variables
# Should show: CLOUDINARY_ENABLED=true
```

### Issue: Upload fails with authentication error

**Check:** Credentials are correct:
- Go to Cloudinary Dashboard
- Copy Cloud Name, API Key, API Secret
- Verify they match environment variables

### Issue: File uploads but can't view

**Check:** BGV.jsx handles Cloudinary URLs:
```javascript
// Should handle https:// URLs
if (docPath.startsWith('http://') || docPath.startsWith('https://')) {
  return docPath;  // ✅ Return Cloudinary URL as-is
}
```

### Issue: Free tier exceeded

**Check:** Cloudinary Dashboard → Usage
- Free tier: 25GB storage, 25GB bandwidth/month
- If exceeded, upgrade or optimize file sizes

---

## 📊 File Size Optimization

To stay within free tier:

### Compress PDFs:
```bash
# Use online tools like:
# - https://www.ilovepdf.com/compress_pdf
# - https://smallpdf.com/compress-pdf
```

### Compress Images:
```bash
# Use online tools like:
# - https://tinypng.com/
# - https://squoosh.app/
```

### Set Upload Size Limit:

**File: `application.properties`**
```properties
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
```

---

## ✅ Summary

**Localhost:**
- Uses local `uploads/tasks/` folder
- Fast, no internet needed
- Files deleted on restart (not a problem for dev)

**Production (Vercel/Railway):**
- Uses Cloudinary cloud storage
- Files persist forever
- Fast CDN delivery
- No server storage needed

**Setup Time:** ~15 minutes

**Cost:** Free (up to 25GB/month)

**Works with:** Any hosting (Vercel, Railway, Render, Heroku, etc.)

---

## 🎉 Final Result

```
Development:
User uploads → Saves to uploads/tasks/ → Views from localhost:8082 ✅

Production:
User uploads → Saves to Cloudinary → Views from Cloudinary CDN ✅
Backend restarts → Files still accessible ✅
Works in Vercel deployment ✅
```

**Need help? Just follow the 7 steps above!** 🚀
