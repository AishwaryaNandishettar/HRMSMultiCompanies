package com.omoikaneinnovation.hmrsbackend.controller;

import com.omoikaneinnovation.hmrsbackend.model.HelpdeskTicket;
import com.omoikaneinnovation.hmrsbackend.service.HelpdeskService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/helpdesk")
@CrossOrigin("*")
public class HelpdeskController {

    private final HelpdeskService service;

    public HelpdeskController(HelpdeskService service) {
        this.service = service;
    }

    // CREATE - any role can create a ticket
    @PostMapping
    public HelpdeskTicket create(@RequestBody HelpdeskTicket t, Authentication auth) {
        // Set raisedBy from authenticated user
        if (auth != null && auth.getName() != null) {
            t.setRaisedBy(auth.getName()); // email from JWT
        }
        return service.create(t);
    }

    // GET ALL - admin/hr sees all, employee/manager sees only their own
    @GetMapping
    public List<HelpdeskTicket> getAll(Authentication auth,
                                       @RequestParam(required = false) String role) {
        String userRole = role != null ? role : "";
        String email = auth != null ? auth.getName() : "";

        if (userRole.equalsIgnoreCase("ADMIN") || userRole.equalsIgnoreCase("HR")) {
            return service.getAll(); // admin sees everything
        } else {
            return service.getByUser(email); // employee/manager sees only their own
        }
    }

    // UPDATE STATUS - admin/hr resolves a ticket
    @PutMapping("/{id}")
    public HelpdeskTicket update(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            Authentication auth
    ) {
        String status = body.getOrDefault("status", "Resolved");
        String resolvedBy = auth != null ? auth.getName() : body.getOrDefault("resolvedBy", "Admin");
        return service.updateStatus(id, status, resolvedBy);
    }

    // DELETE - admin only
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}
