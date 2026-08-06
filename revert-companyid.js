// ========================================================
// REVERT COMPANY ID - Remove companyId from all records
// ========================================================

const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0';

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║   REVERT COMPANY ID - Remove from All Records    ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

async function revertCompanyId() {
    const client = new MongoClient(uri);
    
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas\n');
        
        const db = client.db('Data_base_hrms');
        
        console.log('═══════════════════════════════════════════════════');
        console.log('🔄 REMOVING COMPANY ID FROM ALL RECORDS');
        console.log('═══════════════════════════════════════════════════\n');
        
        // Remove companyId from all users
        console.log('1️⃣  Removing companyId from Users...');
        const usersResult = await db.collection('users').updateMany(
            { companyId: { $exists: true } },
            { $unset: { companyId: "" } }
        );
        console.log(`   ✅ Updated ${usersResult.modifiedCount} user(s)\n`);
        
        // Remove companyId from all employees
        console.log('2️⃣  Removing companyId from Employees...');
        const employeesResult = await db.collection('employees').updateMany(
            { companyId: { $exists: true } },
            { $unset: { companyId: "" } }
        );
        console.log(`   ✅ Updated ${employeesResult.modifiedCount} employee(s)\n`);
        
        // Verify
        console.log('═══════════════════════════════════════════════════');
        console.log('3️⃣  VERIFICATION');
        console.log('═══════════════════════════════════════════════════\n');
        
        const usersWithCompanyId = await db.collection('users').countDocuments({
            companyId: { $exists: true, $ne: null }
        });
        const employeesWithCompanyId = await db.collection('employees').countDocuments({
            companyId: { $exists: true, $ne: null }
        });
        
        console.log('📊 RESULTS:');
        console.log(`   Users with companyId: ${usersWithCompanyId}`);
        console.log(`   Employees with companyId: ${employeesWithCompanyId}`);
        console.log('');
        
        if (usersWithCompanyId === 0 && employeesWithCompanyId === 0) {
            console.log('✅ SUCCESS! All companyId fields have been removed.');
        } else {
            console.log('⚠️  Some records still have companyId.');
        }
        
        console.log('\n═══════════════════════════════════════════════════');
        console.log('✅ DONE!');
        console.log('═══════════════════════════════════════════════════\n');
        
        console.log('🎯 NEXT STEPS:');
        console.log('1. Restart your backend server');
        console.log('2. Refresh browser (F5) or clear cache');
        console.log('3. Login with: Aishwarya@company.com');
        console.log('4. You should now be able to login successfully!\n');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        await client.close();
    }
}

revertCompanyId();
