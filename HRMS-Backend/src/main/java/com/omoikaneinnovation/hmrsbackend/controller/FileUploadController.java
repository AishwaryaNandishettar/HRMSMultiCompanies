package com.omoikaneinnovation.hmrsbackend.controller;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.omoikaneinnovation.hmrsbackend.model.ChatMessage;
import com.omoikaneinnovation.hmrsbackend.repository.MessageRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class FileUploadController {

        private final MessageRepository messageRepository;
        private final SimpMessagingTemplate messagingTemplate;

        private final String UPLOAD_DIR = "uploads/";

        @PostMapping("/upload")
        public ChatMessage uploadFile(
                        @RequestParam("files") List<MultipartFile> files,
                        @RequestParam String senderEmail,
                        @RequestParam String receiverEmail,
                        @RequestParam(required = false) String text,
                        @RequestParam(required = false) String replyTo) throws Exception {

                ChatMessage lastMessage = null;

                for (MultipartFile file : files) {

                        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                        Path path = Paths.get(UPLOAD_DIR + fileName);

                        Files.createDirectories(path.getParent());
                        Files.write(path, file.getBytes());

                        ChatMessage message = ChatMessage.builder()
                                       .senderEmail(senderEmail.trim().toLowerCase())
.receiverEmail(receiverEmail.trim().toLowerCase())
                                        .content(text)
                                        .fileUrl("/uploads/" + fileName)
                                        .fileName(file.getOriginalFilename())
                                        .fileType(file.getContentType())
                                        .timestamp(Instant.now())
                                        .seen(false)
                                        .delivered(true)
                                        .build();

                        // Handle reply to message
                        if (replyTo != null && !replyTo.isEmpty()) {
                                try {
                                        // Parse replyTo JSON
                                        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                                        java.util.Map<String, Object> replyMap = mapper.readValue(replyTo,
                                                        java.util.Map.class);

                                        if (replyMap.containsKey("id")) {
                                                message.setReplyToMessageId((String) replyMap.get("id"));
                                        }

                                        if (replyMap.containsKey("content")) {
                                                String replyContent = (String) replyMap.get("content");
                                                message.setReplyPreview(replyContent != null ? replyContent : "");
                                        }
                                } catch (Exception e) {
                                        // Silently ignore if parsing fails
                                        e.printStackTrace();
                                }
                        }

                        ChatMessage saved = messageRepository.save(message);

                        // SEND REALTIME — normalize emails to match WebSocket principal (lowercase)
                        messagingTemplate.convertAndSendToUser(
                                        receiverEmail.trim().toLowerCase(),
                                        "/queue/messages",
                                        saved);

                        messagingTemplate.convertAndSendToUser(
                                        senderEmail.trim().toLowerCase(),
                                        "/queue/messages",
                                        saved);

                        lastMessage = saved;
                }

                return lastMessage;
        }
}