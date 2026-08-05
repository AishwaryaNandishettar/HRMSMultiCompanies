// ========================================================
// FIX EMPLOYEE DIRECTORY - Node.js Version
// ========================================================
// Run this with: node fix_employee_directory_node.js
// ========================================================

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'Data_base_hrms';
const targetCompanyId = 'omoikaneinnovations';

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║   FIX EMPLOYEE DIRECTORY - CompanyId Sync        ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

async function fixEmployeeDirectory() {
    const client = new MongoClient(uri);
    
    try {
        console.log('📊 STEP 1: Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB\n');
        
        const db = client.db(dbName);
        const usersCollection = db.collection('users');
        const employeesCollection = db.collection('employees');
        
        // Step 2: Check admin user's companyId
        console.log('📊 STEP 2: Checking admin user\'s companyId...');
        console.log('─────────────────────────────────────────────────────');
        
        const adminUsers = await usersCollection.find(
            { role: { $in: ['ADMIN', 'admin', 'Admin'] } },
            { projection: { email: 1, companyId: 1, name: 1, role: 1 } }
        ).toArray();
        
        if (adminUsers.length === 0) {
            console.log('❌ No ADMIN users found!');
            console.log('Creating default admin user...');
            
            await usersCollection.insertOne({
                email: 'admin@omoikaneinnovations.com',
                name: 'Admin User',
                role: 'ADMIN',
                companyId: targetCompanyId,
                password: '$2a$10$abcdefghijklmnopqrstuvwxyz12345678',
                active: true
            });
            
            console.log('✅ Created admin@omoikaneinnovations.com with companyId: "omoikaneinnovations"');
        } else {
            console.log(`✅ Found ${adminUsers.length} admin user(s):\n`);
            adminUsers.forEach(user => {
                console.log(`   👤 ${user.email}`);
                console.log(`      Name: ${user.name || 'N/A'}`);
                console.log(`      CompanyId: ${user.companyId || '❌ NOT SET'}`);
                console.log('');
            });
        }
        
        // Step 3: Check employees' companyId distribution
        console.log('\n📊 STEP 3: Checking employees\' companyId distribution...');
        console.log('─────────────────────────────────────────────────────');
        
        const employeeStats = await employeesCollection.aggregate([
            {
                $group: {
                    _id: '$companyId',
                    count: { $sum: 1 },
                    employees: { $push: '$fullName' }
                }
            },
            { $sort: { _id: 1 } }
        ]).toArray();
        
        if (employeeStats.length === 0) {
            console.log('❌ No employees found in database!');
        } else {
            for (const stat of employeeStats) {
                const companyName = stat._id || '❌ NOT SET';
                console.log(`\n   🏢 CompanyId: ${companyName}`);
                console.log(`      Count: ${stat.count} employees`);
                console.log('      Employees:');
                stat.employees.slice(0, 5).forEach(name => {
                    console.log(`         - ${name}`);
                });
                if (stat.employees.length > 5) {
                    console.log(`         ... and ${stat.employees.length - 5} more`);
                }
            }
        }
        
        // Step 4: Fix - Update all employees and users
        console.log('\n\n🔧 STEP 4: Fixing companyId mismatch...');
        console.log('─────────────────────────────────────────────────────');
        console.log(`   Setting all employees to companyId: '${targetCompanyId}'`);
        
        const employeeUpdateResult = await employeesCollection.updateMany(
            {},
            { $set: { companyId: targetCompanyId } }
        );
        
        console.log(`   ✅ Updated ${employeeUpdateResult.modifiedCount} employees`);
        
        const userUpdateResult = await usersCollection.updateMany(
            { role: { $ne: 'ADMIN' } },
            { $set: { companyId: targetCompanyId } }
        );
        
        console.log(`   ✅ Updated ${userUpdateResult.modifiedCount} users`);
        
        // Step 5: Verify
        console.log('\n\n📊 STEP 5: Verifying fix...');
        console.log('─────────────────────────────────────────────────────');
        
        const verifyEmployees = await employeesCollection.find(
            {},
            { projection: { fullName: 1, email: 1, companyId: 1, employeeId: 1 } }
        ).limit(10).toArray();
        
        if (verifyEmployees.length === 0) {
            console.log('❌ No employees found!');
        } else {
            console.log('✅ First 10 employees:\n');
            verifyEmployees.forEach(emp => {
                const status = emp.companyId === targetCompanyId ? '✅' : '❌';
                console.log(`   ${status} ${emp.fullName || emp.email}`);
                console.log(`      Email: ${emp.email}`);
                console.log(`      EmployeeId: ${emp.employeeId || 'N/A'}`);
                console.log(`      CompanyId: ${emp.companyId}`);
                console.log('');
            });
        }
        
        // Summary
        console.log('\n╔═══════════════════════════════════════════════════╗');
        console.log('║                    SUMMARY                        ║');
        console.log('╚═══════════════════════════════════════════════════╝');
        console.log('');
        console.log(`✅ All employees now have companyId: '${targetCompanyId}'`);
        console.log(`✅ All users now have companyId: '${targetCompanyId}'`);
        console.log('');
        console.log('📝 Next Steps:');
        console.log('   1. Restart your backend server');
        console.log('   2. Clear browser cache and localStorage');
        console.log('   3. Login again and check Employee Directory');
        console.log('');
        console.log('╚═══════════════════════════════════════════════════╝\n');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.error('\nPlease make sure:');
        console.error('  1. MongoDB is running on localhost:27017');
        console.error('  2. Database name is "Data_base_hrms"');
        console.error('  3. You have mongodb npm package installed');
        console.error('\nTo install mongodb package, run: npm install mongodb\n');
        process.exit(1);
    } finally {
        await client.close();
    }
}

// Run the fix
fixEmployeeDirectory();
