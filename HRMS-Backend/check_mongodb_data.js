// ========================================================
// CHECK MONGODB DATA - Diagnose Employee Directory Issue
// ========================================================

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'Data_base_hrms';

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║   CHECK MONGODB DATA - Employee Directory        ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

async function checkData() {
    const client = new MongoClient(uri);
    
    try {
        console.log('📊 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB\n');
        
        const db = client.db(dbName);
        
        // Check Users
        console.log('═══════════════════════════════════════════════════');
        console.log('1️⃣  CHECKING USERS COLLECTION');
        console.log('═══════════════════════════════════════════════════\n');
        
        const users = await db.collection('users').find({
            role: { $in: ['ADMIN', 'admin', 'Admin'] }
        }).toArray();
        
        console.log(`Found ${users.length} admin user(s):\n`);
        users.forEach(user => {
            console.log(`👤 ${user.email}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   CompanyId: ${user.companyId || '❌ NOT SET'}`);
            console.log('');
        });
        
        // Check Employees
        console.log('═══════════════════════════════════════════════════');
        console.log('2️⃣  CHECKING EMPLOYEES COLLECTION');
        console.log('═══════════════════════════════════════════════════\n');
        
        const totalEmployees = await db.collection('employees').countDocuments();
        console.log(`Total employees: ${totalEmployees}\n`);
        
        // Group by companyId
        const byCompanyId = await db.collection('employees').aggregate([
            {
                $group: {
                    _id: '$companyId',
                    count: { $sum: 1 },
                    employees: { $push: { name: '$fullName', id: '$employeeId', email: '$email' } }
                }
            }
        ]).toArray();
        
        console.log('Grouped by companyId:\n');
        byCompanyId.forEach(group => {
            const companyId = group._id || '❌ NULL/UNDEFINED';
            console.log(`🏢 CompanyId: ${companyId}`);
            console.log(`   Count: ${group.count} employees`);
            console.log(`   First 5 employees:`);
            group.employees.slice(0, 5).forEach(emp => {
                console.log(`   - ${emp.name} (${emp.id}) - ${emp.email}`);
            });
            if (group.count > 5) {
                console.log(`   ... and ${group.count - 5} more`);
            }
            console.log('');
        });
        
        // Check specific employees mentioned by user
        console.log('═══════════════════════════════════════════════════');
        console.log('3️⃣  CHECKING SPECIFIC EMPLOYEES');
        console.log('═══════════════════════════════════════════════════\n');
        
        const specificNames = [
            'Lata Benakop',
            'Swati Yadav',
            'Nikita Benakop',
            'Rahul Sharma',
            'Rahul Mandre',
            'Silk Smitha'
        ];
        
        for (const name of specificNames) {
            const emp = await db.collection('employees').findOne({
                fullName: { $regex: name, $options: 'i' }
            });
            
            if (emp) {
                console.log(`✅ Found: ${emp.fullName}`);
                console.log(`   EmployeeId: ${emp.employeeId}`);
                console.log(`   Email: ${emp.email}`);
                console.log(`   CompanyId: ${emp.companyId || '❌ NOT SET'}`);
                console.log('');
            } else {
                console.log(`❌ NOT FOUND: ${name}\n`);
            }
        }
        
        // Summary
        console.log('═══════════════════════════════════════════════════');
        console.log('4️⃣  DIAGNOSIS');
        console.log('═══════════════════════════════════════════════════\n');
        
        const adminWithCompanyId = users.filter(u => u.companyId).length;
        const adminWithoutCompanyId = users.filter(u => !u.companyId).length;
        
        const employeesWithCompanyId = await db.collection('employees').countDocuments({
            companyId: { $exists: true, $ne: null }
        });
        const employeesWithoutCompanyId = await db.collection('employees').countDocuments({
            $or: [
                { companyId: { $exists: false } },
                { companyId: null }
            ]
        });
        
        console.log('📊 Admin Users:');
        console.log(`   ✅ With companyId: ${adminWithCompanyId}`);
        console.log(`   ❌ Without companyId: ${adminWithoutCompanyId}`);
        console.log('');
        
        console.log('📊 Employees:');
        console.log(`   ✅ With companyId: ${employeesWithCompanyId}`);
        console.log(`   ❌ Without companyId: ${employeesWithoutCompanyId}`);
        console.log('');
        
        if (adminWithoutCompanyId > 0) {
            console.log('⚠️  ISSUE FOUND: Admin users missing companyId');
            console.log('   Solution: Run fix_admin_companyid.js\n');
        }
        
        if (employeesWithoutCompanyId > 0) {
            console.log('⚠️  ISSUE FOUND: Employees missing companyId');
            console.log('   Solution: Run fix_all_employee_companyid.js\n');
        }
        
        if (adminWithCompanyId > 0 && employeesWithCompanyId > 0) {
            console.log('✅ GOOD: Both admins and employees have companyId set');
            console.log('   If Employee Directory still shows wrong data:');
            console.log('   1. Clear browser cache (F12 > Application > Clear site data)');
            console.log('   2. Check browser console for API errors');
            console.log('   3. Check backend logs for companyId value');
            console.log('');
        }
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        process.exit(1);
    } finally {
        await client.close();
    }
}

checkData();
