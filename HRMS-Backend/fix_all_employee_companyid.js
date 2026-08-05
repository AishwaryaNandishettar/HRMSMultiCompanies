// ========================================================
// FIX ALL EMPLOYEES - Set CompanyId
// ========================================================

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'Data_base_hrms';
const targetCompanyId = 'omoikaneinnovations';

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║   FIX ALL EMPLOYEES - Set CompanyId              ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

async function fixAllEmployees() {
    const client = new MongoClient(uri);
    
    try {
        console.log('📊 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB\n');
        
        const db = client.db(dbName);
        
        // Fix Admin Users
        console.log('═══════════════════════════════════════════════════');
        console.log('STEP 1: Fix Admin Users');
        console.log('═══════════════════════════════════════════════════\n');
        
        const adminResult = await db.collection('users').updateMany(
            { role: { $in: ['ADMIN', 'admin', 'Admin'] } },
            { $set: { companyId: targetCompanyId } }
        );
        
        console.log(`✅ Updated ${adminResult.modifiedCount} admin user(s)`);
        console.log(`   Matched ${adminResult.matchedCount} admin user(s)\n`);
        
        // Fix All Employees
        console.log('═══════════════════════════════════════════════════');
        console.log('STEP 2: Fix All Employees');
        console.log('═══════════════════════════════════════════════════\n');
        
        const empResult = await db.collection('employees').updateMany(
            {},
            { $set: { companyId: targetCompanyId } }
        );
        
        console.log(`✅ Updated ${empResult.modifiedCount} employee(s)`);
        console.log(`   Matched ${empResult.matchedCount} employee(s)\n`);
        
        // Verify Admin Users
        console.log('═══════════════════════════════════════════════════');
        console.log('STEP 3: Verify Admin Users');
        console.log('═══════════════════════════════════════════════════\n');
        
        const admins = await db.collection('users').find({
            role: { $in: ['ADMIN', 'admin', 'Admin'] }
        }).toArray();
        
        admins.forEach(admin => {
            const status = admin.companyId === targetCompanyId ? '✅' : '❌';
            console.log(`${status} ${admin.email} - companyId: ${admin.companyId}`);
        });
        console.log('');
        
        // Verify Employees
        console.log('═══════════════════════════════════════════════════');
        console.log('STEP 4: Verify Employees');
        console.log('═══════════════════════════════════════════════════\n');
        
        const totalEmployees = await db.collection('employees').countDocuments();
        const withCompanyId = await db.collection('employees').countDocuments({
            companyId: targetCompanyId
        });
        const withoutCompanyId = await db.collection('employees').countDocuments({
            $or: [
                { companyId: { $exists: false } },
                { companyId: null },
                { companyId: { $ne: targetCompanyId } }
            ]
        });
        
        console.log(`Total employees: ${totalEmployees}`);
        console.log(`✅ With correct companyId: ${withCompanyId}`);
        console.log(`❌ Without correct companyId: ${withoutCompanyId}\n`);
        
        // Show first 10 employees
        console.log('First 10 employees:');
        const sampleEmployees = await db.collection('employees').find({}).limit(10).toArray();
        sampleEmployees.forEach(emp => {
            const status = emp.companyId === targetCompanyId ? '✅' : '❌';
            console.log(`${status} ${emp.fullName} (${emp.employeeId}) - companyId: ${emp.companyId}`);
        });
        console.log('');
        
        // Final Summary
        console.log('╔═══════════════════════════════════════════════════╗');
        console.log('║                    SUCCESS!                       ║');
        console.log('╚═══════════════════════════════════════════════════╝\n');
        
        console.log(`✅ All admin users have companyId: '${targetCompanyId}'`);
        console.log(`✅ All ${totalEmployees} employees have companyId: '${targetCompanyId}'`);
        console.log('');
        
        console.log('📝 NEXT STEPS:');
        console.log('   1. Restart your backend server (if running)');
        console.log('   2. Clear browser cache:');
        console.log('      - Press F12');
        console.log('      - Go to Application tab');
        console.log('      - Click "Clear site data"');
        console.log('   3. Close and reopen browser');
        console.log('   4. Login to http://localhost:5173');
        console.log('   5. Check Employee Directory');
        console.log('');
        console.log('✅ Employee Directory should now show correct employees!');
        console.log('');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error(error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

fixAllEmployees();
