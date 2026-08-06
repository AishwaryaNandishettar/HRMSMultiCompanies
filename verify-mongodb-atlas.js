// ========================================================
// VERIFY MONGODB ATLAS CONNECTION - Show Real Employee Data
// ========================================================

const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0';

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║   VERIFY MONGODB ATLAS - Employee Data Check     ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

async function verifyAtlasData() {
    const client = new MongoClient(uri);
    
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas Cloud\n');
        
        const db = client.db('Data_base_hrms');
        
        // Check Employees Collection
        console.log('═══════════════════════════════════════════════════');
        console.log('📊 EMPLOYEES IN MONGODB ATLAS');
        console.log('═══════════════════════════════════════════════════\n');
        
        const employees = await db.collection('employees').find({}).toArray();
        
        console.log(`✅ Total Employees: ${employees.length}\n`);
        
        employees.forEach((emp, index) => {
            console.log(`${index + 1}. ${emp.fullName || emp.name || 'Unknown'}`);
            console.log(`   📧 Email: ${emp.email}`);
            console.log(`   🆔 Employee ID: ${emp.employeeId}`);
            console.log(`   🏢 Company ID: ${emp.companyId || '❌ NOT SET'}`);
            console.log(`   📱 Department: ${emp.department || 'N/A'}`);
            console.log(`   💼 Designation: ${emp.designation || 'N/A'}`);
            console.log(`   📊 Status: ${emp.status || 'N/A'}`);
            console.log('');
        });
        
        // Check Users Collection
        console.log('═══════════════════════════════════════════════════');
        console.log('👥 USERS IN MONGODB ATLAS');
        console.log('═══════════════════════════════════════════════════\n');
        
        const users = await db.collection('users').find({}).toArray();
        
        console.log(`✅ Total Users: ${users.length}\n`);
        
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name || 'Unknown'}`);
            console.log(`   📧 Email: ${user.email}`);
            console.log(`   👤 Role: ${user.role}`);
            console.log(`   🏢 Company ID: ${user.companyId || '❌ NOT SET'}`);
            console.log('');
        });
        
        // Summary
        console.log('═══════════════════════════════════════════════════');
        console.log('✅ VERIFICATION SUMMARY');
        console.log('═══════════════════════════════════════════════════\n');
        
        console.log(`✅ MongoDB Atlas is working correctly`);
        console.log(`✅ Database: Data_base_hrms`);
        console.log(`✅ Total Employees: ${employees.length}`);
        console.log(`✅ Total Users: ${users.length}`);
        console.log('');
        
        const employeesWithCompanyId = employees.filter(e => e.companyId);
        console.log(`📊 Employees with Company ID: ${employeesWithCompanyId.length}/${employees.length}`);
        
        if (employeesWithCompanyId.length < employees.length) {
            console.log(`⚠️  WARNING: ${employees.length - employeesWithCompanyId.length} employees missing companyId`);
        }
        
        console.log('\n✅ NEXT STEPS:');
        console.log('1. Restart your backend server');
        console.log('2. Clear browser cache completely (Ctrl+Shift+Delete)');
        console.log('3. Or use Incognito mode: Ctrl+Shift+N (Chrome) or Ctrl+Shift+P (Firefox)');
        console.log('4. Login again and check Employee Directory');
        console.log('\n💡 If still showing wrong data, hard refresh: Ctrl+Shift+R');
        console.log('');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('\n🔧 TROUBLESHOOTING:');
        console.error('1. Check internet connection');
        console.error('2. Verify MongoDB Atlas cluster is running');
        console.error('3. Check if IP address is whitelisted in MongoDB Atlas');
        process.exit(1);
    } finally {
        await client.close();
    }
}

verifyAtlasData();
