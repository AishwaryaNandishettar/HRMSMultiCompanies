package com.omoikaneinnovation.hmrsbackend.service;

import com.omoikaneinnovation.hmrsbackend.model.Payroll;
import com.omoikaneinnovation.hmrsbackend.repository.PayrollRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PayrollService {

    private final PayrollRepository repo;
    

    public PayrollService(PayrollRepository repo) {
        this.repo = repo;
    }

    public Payroll createPayroll(Payroll p){
        return repo.save(p);
    }

    public List<Payroll> getAll(){
        return repo.findAll();
    }

    public List<Payroll> getEmployeePayroll(String empCode){
        return repo.findByEmpCode(empCode);
    }

    public Payroll updatePayroll(String empId, Payroll p){
        p.setEmployeeId(empId);
        return repo.save(p);
    }

    public Payroll processPayroll(String employeeId) {

Payroll payroll = repo.findTopByEmployeeIdOrderByUpdatedAtDesc(employeeId);

if (payroll == null) {
    payroll = repo.findByEmpCode(employeeId).stream().findFirst().orElse(null);
}

    payroll.setPayrollStatus("PROCESSING");
    repo.save(payroll);

    try {
        Thread.sleep(2000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }

    payroll.setGross(15000.0);
    payroll.setNet(12000.0);
    payroll.setPayrollStatus("SUCCESSFUL");
    payroll.setSalaryStatus("CREDITED");

    return repo.save(payroll);
}

    // ✅ FIXED: Proper upsert — update existing records, don't reset to 0
    public List<Payroll> saveAll(List<Payroll> payrollList) {

        List<Payroll> toSave = new java.util.ArrayList<>();

        for (Payroll incoming : payrollList) {
            // Try to find existing record for this employee
        Payroll existing = repo.findTopByEmployeeIdOrderByUpdatedAtDesc(incoming.getEmployeeId());

java.util.Optional<Payroll> existingOpt = java.util.Optional.ofNullable(existing);

if (existingOpt.isPresent()) {
    Payroll existingData = existingOpt.get();

    incoming.setId(existingData.getId());

    if (incoming.getPayrollStatus() == null) {
        incoming.setPayrollStatus(existingData.getPayrollStatus());
    }
    if (incoming.getSalaryStatus() == null) {
        incoming.setSalaryStatus(existingData.getSalaryStatus());
    }

    if (existingData.getInitiatedAt() != null) {
        incoming.setInitiatedAt(existingData.getInitiatedAt());
        incoming.setInitiatedDate(existingData.getInitiatedDate());
    } else {
        long now = System.currentTimeMillis();
        incoming.setInitiatedAt(now);
        incoming.setInitiatedDate(formatDate(now));
    }
} else {
    incoming.setPayrollStatus("INITIATED");
    long now = System.currentTimeMillis();
    incoming.setInitiatedAt(now);
    incoming.setInitiatedDate(formatDate(now));
}
            // Ensure status is uppercase
            String statusValue = (incoming.getStatus() != null) ? incoming.getStatus().toUpperCase() : "ACTIVE";
            incoming.setStatus(statusValue);
            incoming.setRecordStatus(statusValue);
            incoming.setUpdatedAt(System.currentTimeMillis());

            System.out.println("🔥 UPSERTING PAYROLL: empId=" + incoming.getEmployeeId() + 
                             ", basic=" + incoming.getBasic() + 
                             ", net=" + incoming.getNet());

            toSave.add(incoming);
        }

        List<Payroll> saved = repo.saveAll(toSave);
        System.out.println("✅ PAYROLL BATCH SAVED: " + saved.size() + " records");
        return saved;
    }

    // Helper: format timestamp to readable date
    private String formatDate(long timestamp) {
        java.time.LocalDate date = java.time.Instant.ofEpochMilli(timestamp)
            .atZone(java.time.ZoneId.systemDefault())
            .toLocalDate();
        return date.format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy"));
    }

    public List<Payroll> processAllPayroll() {

    List<Payroll> list = repo.findAll();

    // Step 1: set PROCESSING
    list.forEach(p -> p.setPayrollStatus("PROCESSING"));
    repo.saveAll(list);

    try {
        Thread.sleep(2000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }

    // Step 2: set SUCCESSFUL + CREDITED
    list.forEach(p -> {
        p.setGross(15000.0);
        p.setNet(12000.0);
        p.setPayrollStatus("SUCCESSFUL");
        p.setSalaryStatus("CREDITED");
    });

    return repo.saveAll(list);
}
}