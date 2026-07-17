package com.omoikaneinnovation.hmrsbackend.controller;

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

    private static final String UPLOAD_DIR = "uploads/tasks/";

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            System.out.println("📤 File upload request received");
            System.out.println("   File name: " + file.getOriginalFilename());
            System.out.println("   File size: " + file.getSize() + " bytes");
            
            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                System.out.println("   Created directory: " + uploadPath.toAbsolutePath());
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf("."))
                    : "";
            String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

            // Save file
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            System.out.println("   ✅ File saved to: " + filePath.toAbsolutePath());
            System.out.println("   📂 File URL: /uploads/tasks/" + uniqueFilename);

            // Return file URL
            Map<String, String> response = new HashMap<>();
            response.put("fileUrl", "/uploads/tasks/" + uniqueFilename);
            response.put("fileName", originalFilename);
            response.put("message", "File uploaded successfully");

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            System.err.println("❌ File upload error: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    /**
     * Test endpoint to verify file serving is working
     */
    @GetMapping("/test-upload")
    public ResponseEntity<Map<String, Object>> testUploadDirectory() {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            Map<String, Object> response = new HashMap<>();
            
            response.put("uploadDirectory", uploadPath.toAbsolutePath().toString());
            response.put("directoryExists", Files.exists(uploadPath));
            response.put("isDirectory", Files.isDirectory(uploadPath));
            
            if (Files.exists(uploadPath)) {
                long fileCount = Files.list(uploadPath).count();
                response.put("fileCount", fileCount);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
}
