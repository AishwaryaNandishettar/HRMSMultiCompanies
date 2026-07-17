// Quick check for Aishwarya's company assignment
db.users.findOne(
  { email: "Aishwarya@company.com" },
  { email: 1, companyId: 1, name: 1, role: 1 }
)
