// ========================================================
// FIX COMPANY ID FOR ALL EMPLOYEES IN MONGODB ATLAS
// ========================================================

const { MongoClient } = require('mongodb');
const readline = require('readline');

const uri = 'mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║   FIX COMPANY ID - MongoDB Atlas Employees       ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

async function fixCompanyId() {
    const client = new MongoClient(uri);
    
    try {
        console.log('🔌 Connecting to MongoDB Atlas...');
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas\n');
        
        const db = client.db('Data_base_hrms');
        
        // Step 1: Find admin users
        console.log('═══════════════════════════════════════════════════');
        console.log('1️⃣  FINDING ADMIN USERS');
        console.log('═══════════════════════════════════════════════════\n');
        
        const admins = await db.collection('users').find({
            role: { $regex: /^admin$/i }
        }).toArray();
        
        console.log(`Found ${admins.length} admin user(s):\n`);
        admins.forEach((admin, index) => {
            console.log(`${index + 1}. ${admin.email}`);
            console.log(`   Name: ${admin.name || 'Unknown'}`);
            console.log(`   Company ID: ${admin.companyId || '❌ NOT SET'}`);
            console.log('');
        });
        
        if (admins.length === 0) {
            console.log('❌ No admin users found!');
            console.log('Please ensure you have at least one admin user.');
            process.exit(1);
        }
        
        // Step 2: Check which admin has companyId
        const adminWithCompanyId = admins.find(a => a.companyId);
        
        let companyIdToUse;
        
        if (adminWithCompanyId) {
            companyIdToUse = adminWithCompanyId.companyId;
            console.log(`✅ Found admin with companyId: ${adminWithCompanyId.email}`);
            console.log(`   Company ID: ${companyIdToUse}\n`);
        } else {
            console.log('⚠️  No admin has companyId set!');
            console.log('We will generate a new companyId for all.\n');
            
            // Generate a companyId
            companyIdToUse = `COMP-${Date.now()}`;
            console.log(`✅ Generated new Company ID: ${companyIdToUse}\n`);
            
            // Ask user if they want to proceed
            const answer = await new Promise(resolve => {
                rl.question(`Do you want to set this companyId for all admins and employees? (yes/no): `, resolve);
            });
            
            if (answer.toLowerCase() !== 'yes') {
                console.log('\n❌ Operation cancelled by user.');
                process.exit(0);
            }
            
            // Update all admin users with this companyId
            console.log(`\n🔧 Setting companyId for ${admins.length} admin user(s)...`);
            for (const admin of admins) {
                await db.collection('users').updateOne(
                    { _id: admin._id },
                    { $set: { companyId: companyIdToUse } }
                );
                console.log(`   ✅ Updated: ${admin.email}`);
            }
        }
        
        // Step 3: Update all employees
        console.log('\n═══════════════════════════════════════════════════');
        console.log('2️⃣  UPDATING EMPLOYEES WITH COMPANY ID');
        console.log('═══════════════════════════════════════════════════\n');
        
        const employeesWithoutCompanyId = await db.collection('employees').find({
            $or: [
                { companyId: { $exists: false } },
                { companyId: null },
                { companyId: '' }
            ]
        }).toArray();
        
        console.log(`Found ${employeesWithoutCompanyId.length} employees without companyId\n`);
        
        if (employeesWithoutCompanyId.length === 0) {
            console.log('✅ All employees already have companyId set!');
        } else {
            const answer = await new Promise(resolve => {
                rl.question(`Update ${employeesWithoutCompanyId.length} employees with companyId "${companyIdToUse}"? (yes/no): `, resolve);
            });
            
            if (answer.toLowerCase() === 'yes') {
                const result = await db.collection('employees').updateMany(
                    {
                        $or: [
                            { companyId: { $exists: false } },
                            { companyId: null },
                            { companyId: '' }
                        ]
                    },
                    { $set: { companyId: companyIdToUse } }
                );
                
                console.log(`\n✅ Updated ${result.modifiedCount} employees with companyId: ${companyIdToUse}`);
            } else {
                console.log('\n❌ Employee update cancelled by user.');
            }
        }
        
        // Step 4: Verify
        console.log('\n═══════════════════════════════════════════════════');
        console.log('3️⃣  VERIFICATION');
        console.log('═══════════════════════════════════════════════════\n');
        
        const employeesWithCompanyId = await db.collection('employees').countDocuments({
            companyId: companyIdToUse
        });
        
        const adminsWithCompanyId = await db.collection('users').countDocuments({
            role: { $regex: /^admin$/i },
            companyId: companyIdToUse
        });
        
        console.log(`✅ Admins with companyId "${companyIdToUse}": ${adminsWithCompanyId}`);
        console.log(`✅ Employees with companyId "${companyIdToUse}": ${employeesWithCompanyId}`);
        
        console.log('\n═══════════════════════════════════════════════════');
        console.log('✅ DONE!');
        console.log('═══════════════════════════════════════════════════\n');
        
        console.log('🎯 NEXT STEPS:');
        console.log('1. Restart your backend server');
        console.log('2. Clear browser cache (Ctrl+Shift+Delete) or use Incognito (Ctrl+Shift+N)');
        console.log('3. Login with admin credentials');
        console.log('4. Navigate to Employee Directory');
        console.log('5. You should now see all 12 employees correctly!\n');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        process.exit(1);
    } finally {
        rl.close();
        await client.close();
    }
}

fixCompanyId();
