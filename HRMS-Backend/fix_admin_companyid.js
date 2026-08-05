// ========================================================
// FIX ADMIN USERS - Set CompanyId
// ========================================================

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'Data_base_hrms';
const targetCompanyId = 'omoikaneinnovations';

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║   FIX ADMIN USERS - Set CompanyId                ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

async function fixAdminCompanyId() {
    const client = new MongoClient(uri);
    
    try {
        console.log('📊 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB\n');
        
        const db = client.db(dbName);
        const usersCollection = db.collection('users');
        
        // Update admin users
        console.log('🔧 Setting companyId for admin users...');
        console.log('─────────────────────────────────────────────────────');
        
        const result = await usersCollection.updateMany(
            { role: { $in: ['ADMIN', 'admin', 'Admin'] } },
            { $set: { companyId: targetCompanyId } }
        );
        
        console.log(`✅ Updated ${result.modifiedCount} admin user(s)`);
        
        // Verify
        console.log('\n📊 Verifying admin users...');
        console.log('─────────────────────────────────────────────────────');
        
        const admins = await usersCollection.find(
            { role: { $in: ['ADMIN', 'admin', 'Admin'] } },
            { projection: { email: 1, name: 1, companyId: 1, _id: 0 } }
        ).toArray();
        
        admins.forEach(admin => {
            const status = admin.companyId === targetCompanyId ? '✅' : '❌';
            console.log(`${status} ${admin.email}`);
            console.log(`   Name: ${admin.name}`);
            console.log(`   CompanyId: ${admin.companyId}`);
            console.log('');
        });
        
        console.log('╔═══════════════════════════════════════════════════╗');
        console.log('║                  SUCCESS!                         ║');
        console.log('╚═══════════════════════════════════════════════════╝');
        console.log('');
        console.log(`✅ All admin users now have companyId: '${targetCompanyId}'`);
        console.log('');
        console.log('📝 Next Steps:');
        console.log('   1. Restart your backend server');
        console.log('   2. Clear browser cache (F12 > Application > Clear site data)');
        console.log('   3. Login and check Employee Directory');
        console.log('');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        process.exit(1);
    } finally {
        await client.close();
    }
}

fixAdminCompanyId();
