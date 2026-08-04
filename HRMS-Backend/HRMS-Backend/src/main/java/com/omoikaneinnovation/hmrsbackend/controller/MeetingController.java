package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.Meeting;
import com.omoikaneinnovation.hmrsbackend.repository.MeetingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import com.omoikaneinnovation.hmrsbackend.service.MeetingEmailService;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(originPatterns = { "http://localhost:*", "https://*.ngrok-free.dev" })
public class MeetingController {

    private final MeetingRepository meetingRepository;
    private final MeetingEmailService meetingEmailService;

    public MeetingController(MeetingRepository meetingRepository,
            MeetingEmailService meetingEmailService) {
        this.meetingRepository = meetingRepository;
        this.meetingEmailService = meetingEmailService;
    }

    /**
     * Check if a participant has a conflicting meeting at the given time.
     * GET /api/meetings/check-conflict?email=...&start=...&end=...&excludeId=...
     */
    @GetMapping("/check-conflict")
    public ResponseEntity<Map<String, Object>> checkConflict(
            @RequestParam String email,
            @RequestParam String start,
            @RequestParam String end,
            @RequestParam(required = false) String excludeId,
            Principal principal) {

        if (principal == null) return ResponseEntity.status(401).build();

        Instant startTime = Instant.parse(start);
        Instant endTime   = Instant.parse(end);

        List<Meeting> conflicts = meetingRepository.findConflictingMeetings(email, startTime, endTime);

        // Exclude the meeting being edited (if any)
        if (excludeId != null && !excludeId.isBlank()) {
            conflicts = conflicts.stream()
                    .filter(m -> !m.getId().equals(excludeId))
                    .toList();
        }

        Map<String, Object> result = new HashMap<>();
        result.put("hasConflict", !conflicts.isEmpty());
        if (!conflicts.isEmpty()) {
            Meeting c = conflicts.get(0);
            result.put("conflictingMeetingTitle", c.getTitle());
            result.put("conflictingMeetingStart", c.getStartTime().toString());
            result.put("conflictingMeetingEnd",   c.getEndTime().toString());
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Helper: collect all participants with conflicts and return a descriptive message.
     * Returns null if no conflicts found.
     */
    private String findConflictsForParticipants(List<String> emails, Instant start, Instant end, String excludeId) {
        List<String> conflicted = new ArrayList<>();
        for (String email : emails) {
            List<Meeting> conflicts = meetingRepository.findConflictingMeetings(email, start, end);
            if (excludeId != null) {
                conflicts = conflicts.stream().filter(m -> !m.getId().equals(excludeId)).toList();
            }
            if (!conflicts.isEmpty()) {
                conflicted.add(email + " (conflicts with: \"" + conflicts.get(0).getTitle() + "\")");
            }
        }
        if (conflicted.isEmpty()) return null;
        return "The following participant(s) already have a meeting at this time: " + String.join(", ", conflicted);
    }

    @PostMapping
    public ResponseEntity<?> createMeeting(@RequestBody Meeting meeting, Principal principal) {
        String email = principal != null ? principal.getName() : null;
        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        // Check for participant conflicts
        if (meeting.getParticipantEmails() != null && meeting.getStartTime() != null && meeting.getEndTime() != null) {
            String conflictMsg = findConflictsForParticipants(
                    meeting.getParticipantEmails(), meeting.getStartTime(), meeting.getEndTime(), null);
            if (conflictMsg != null) {
                return ResponseEntity.status(409).body(Map.of("message", conflictMsg));
            }
        }

        meeting.setCreatedByEmail(email);
        meeting.setCreatedAt(Instant.now());
        Meeting saved = meetingRepository.save(meeting);
        meetingEmailService.sendMeetingInvitation(saved);
        meetingEmailService.scheduleMeetingReminders(saved);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Meeting>> getMeetingsForUser(@RequestParam(required = false) String email,
            Principal principal) {
        String currentEmail = email;
        if (currentEmail == null && principal != null) {
            currentEmail = principal.getName();
        }

        if (currentEmail == null) {
            return ResponseEntity.status(400).build();
        }

        List<Meeting> meetings = meetingRepository.findAllMeetingsForUser(currentEmail);
        return ResponseEntity.ok(meetings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Meeting> getMeetingById(@PathVariable String id, Principal principal) {
        String email = principal != null ? principal.getName() : null;
        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        Meeting meeting = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        if (!meeting.getCreatedByEmail().equalsIgnoreCase(email)
                && (meeting.getParticipantEmails() == null || meeting.getParticipantEmails().stream()
                        .noneMatch(participant -> participant.equalsIgnoreCase(email)))) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(meeting);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMeeting(@PathVariable String id,
            @RequestBody Meeting meeting,
            Principal principal) {
        String email = principal != null ? principal.getName() : null;
        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        Meeting existing = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        if (!existing.getCreatedByEmail().equals(email)
                && (existing.getParticipantEmails() == null || !existing.getParticipantEmails().contains(email))) {
            return ResponseEntity.status(403).build();
        }

        // Check for participant conflicts (skip if cancelling)
        if (!"Cancelled".equalsIgnoreCase(meeting.getStatus())
                && meeting.getParticipantEmails() != null
                && meeting.getStartTime() != null
                && meeting.getEndTime() != null) {
            String conflictMsg = findConflictsForParticipants(
                    meeting.getParticipantEmails(), meeting.getStartTime(), meeting.getEndTime(), id);
            if (conflictMsg != null) {
                return ResponseEntity.status(409).body(Map.of("message", conflictMsg));
            }
        }

        existing.setTitle(meeting.getTitle());
        existing.setDescription(meeting.getDescription());
        existing.setParticipantEmails(meeting.getParticipantEmails());
        existing.setRemarks(meeting.getRemarks());
        existing.setStartTime(meeting.getStartTime());
        existing.setEndTime(meeting.getEndTime());
        existing.setStatus(meeting.getStatus());
        existing.setRepeat(meeting.getRepeat());
        existing.setRepeatUntil(meeting.getRepeatUntil());
        existing.setRepeatCount(meeting.getRepeatCount());
        existing.setDaysOfWeek(meeting.getDaysOfWeek());
        existing.setCreatedByEmail(existing.getCreatedByEmail());
        existing.setCreatedAt(existing.getCreatedAt());

        Meeting updated = meetingRepository.save(existing);

        if ("Cancelled".equalsIgnoreCase(updated.getStatus())) {
            meetingEmailService.sendMeetingCancellation(updated, "The meeting has been cancelled.");
        } else {
            meetingEmailService.sendMeetingUpdate(updated, "Meeting details have changed");
            meetingEmailService.scheduleMeetingReminders(updated);
        }

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMeeting(@PathVariable String id,
            Principal principal) {
        String email = principal != null ? principal.getName() : null;
        if (email == null) {
            return ResponseEntity.status(401).build();
        }

        Meeting existing = meetingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        if (!existing.getCreatedByEmail().equals(email)
                && (existing.getParticipantEmails() == null || !existing.getParticipantEmails().contains(email))) {
            return ResponseEntity.status(403).build();
        }

        meetingRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
