// ========================================================
// AUTO FIX COMPANY ID - No User Input Required
// ========================================================

const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0';

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║   AUTO FIX COMPANY ID - MongoDB Atlas            ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

async function autoFixCompanyId() {
    const client = new MongoClient(uri);
    
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas\n');
        
        const db = client.db('Data_base_hrms');
        
        // Use a default companyId
        const defaultCompanyId = 'OMOIKANE-INNOVATIONS';
        
        console.log('═══════════════════════════════════════════════════');
        console.log('🏢 SETTING DEFAULT COMPANY ID');
        console.log('═══════════════════════════════════════════════════\n');
        console.log(`Company ID: ${defaultCompanyId}\n`);
        
        // Step 1: Update all admin users
        console.log('1️⃣  Updating Admin Users...');
        const adminResult = await db.collection('users').updateMany(
            { 
                role: { $regex: /^admin$/i },
                $or: [
                    { companyId: { $exists: false } },
                    { companyId: null },
                    { companyId: '' }
                ]
            },
            { $set: { companyId: defaultCompanyId } }
        );
        console.log(`   ✅ Updated ${adminResult.modifiedCount} admin user(s)\n`);
        
        // Step 2: Update all employees
        console.log('2️⃣  Updating Employees...');
        const employeeResult = await db.collection('employees').updateMany(
            {
                $or: [
                    { companyId: { $exists: false } },
                    { companyId: null },
                    { companyId: '' }
                ]
            },
            { $set: { companyId: defaultCompanyId } }
        );
        console.log(`   ✅ Updated ${employeeResult.modifiedCount} employee(s)\n`);
        
        // Step 3: Update all other users (managers, HR, etc.)
        console.log('3️⃣  Updating Other Users...');
        const otherUsersResult = await db.collection('users').updateMany(
            {
                role: { $not: { $regex: /^admin$/i } },
                $or: [
                    { companyId: { $exists: false } },
                    { companyId: null },
                    { companyId: '' }
                ]
            },
            { $set: { companyId: defaultCompanyId } }
        );
        console.log(`   ✅ Updated ${otherUsersResult.modifiedCount} other user(s)\n`);
        
        // Step 4: Verify
        console.log('═══════════════════════════════════════════════════');
        console.log('4️⃣  VERIFICATION');
        console.log('═══════════════════════════════════════════════════\n');
        
        const totalAdmins = await db.collection('users').countDocuments({
            role: { $regex: /^admin$/i }
        });
        const adminsWithCompanyId = await db.collection('users').countDocuments({
            role: { $regex: /^admin$/i },
            companyId: defaultCompanyId
        });
        
        const totalEmployees = await db.collection('employees').countDocuments({});
        const employeesWithCompanyId = await db.collection('employees').countDocuments({
            companyId: defaultCompanyId
        });
        
        const totalOtherUsers = await db.collection('users').countDocuments({
            role: { $not: { $regex: /^admin$/i } }
        });
        const otherUsersWithCompanyId = await db.collection('users').countDocuments({
            role: { $not: { $regex: /^admin$/i } },
            companyId: defaultCompanyId
        });
        
        console.log('📊 RESULTS:');
        console.log(`   Admins: ${adminsWithCompanyId}/${totalAdmins} have companyId`);
        console.log(`   Employees: ${employeesWithCompanyId}/${totalEmployees} have companyId`);
        console.log(`   Other Users: ${otherUsersWithCompanyId}/${totalOtherUsers} have companyId`);
        console.log('');
        
        if (employeesWithCompanyId === totalEmployees && adminsWithCompanyId === totalAdmins) {
            console.log('✅ SUCCESS! All users and employees now have companyId set.');
        } else {
            console.log('⚠️  Some records still missing companyId. Please check manually.');
        }
        
        // Show sample employees
        console.log('\n═══════════════════════════════════════════════════');
        console.log('5️⃣  SAMPLE EMPLOYEES (First 5)');
        console.log('═══════════════════════════════════════════════════\n');
        
        const sampleEmployees = await db.collection('employees')
            .find({ companyId: defaultCompanyId })
            .limit(5)
            .toArray();
        
        sampleEmployees.forEach((emp, index) => {
            console.log(`${index + 1}. ${emp.fullName || emp.name}`);
            console.log(`   Email: ${emp.email}`);
            console.log(`   Company ID: ${emp.companyId}`);
            console.log('');
        });
        
        console.log('═══════════════════════════════════════════════════');
        console.log('✅ DONE!');
        console.log('═══════════════════════════════════════════════════\n');
        
        console.log('🎯 NEXT STEPS:');
        console.log('1. Restart your backend server (if running)');
        console.log('2. Clear browser cache completely:');
        console.log('   - Press Ctrl+Shift+Delete');
        console.log('   - Select "All time"');
        console.log('   - Check "Cached images and files"');
        console.log('   - Click "Clear data"');
        console.log('');
        console.log('3. OR use Incognito mode (easier):');
        console.log('   - Press Ctrl+Shift+N (Chrome) or Ctrl+Shift+P (Firefox)');
        console.log('   - Go to http://localhost:5173');
        console.log('');
        console.log('4. Login with: Aishwarya@company.com');
        console.log('5. Go to Employee Directory');
        console.log('6. You should now see all 12 employees!\n');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error(error.stack);
        process.exit(1);
    } finally {
        await client.close();
    }
}

autoFixCompanyId();
