// Reset admin password to a known value
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017';
const dbName = 'Data_base_hrms';
const email = 'Aishwarya@company.com';
const newPassword = 'admin123'; // Simple password for testing

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║   RESET ADMIN PASSWORD                            ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

async function resetPassword() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB\n');
        
        const db = client.db(dbName);
        
        // Check if user exists
        const user = await db.collection('users').findOne({ email: email });
        
        if (!user) {
            console.log('❌ User not found:', email);
            console.log('   Available users:');
            const allUsers = await db.collection('users').find({}).toArray();
            allUsers.forEach(u => console.log('   -', u.email));
            return;
        }
        
        console.log('✅ User found:', email);
        console.log('   Current details:');
        console.log('   - Name:', user.name);
        console.log('   - Role:', user.role);
        console.log('   - CompanyId:', user.companyId);
        console.log('');
        
        // Hash the new password
        console.log('🔐 Hashing new password...');
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        console.log('✅ Password hashed');
        console.log('');
        
        // Update the password
        console.log('💾 Updating password in database...');
        const result = await db.collection('users').updateOne(
            { email: email },
            { $set: { password: hashedPassword } }
        );
        
        if (result.modifiedCount > 0) {
            console.log('✅ Password updated successfully!');
            console.log('');
            console.log('╔═══════════════════════════════════════════════════╗');
            console.log('║                NEW LOGIN CREDENTIALS              ║');
            console.log('╚═══════════════════════════════════════════════════╝');
            console.log('');
            console.log('  Email:', email);
            console.log('  Password:', newPassword);
            console.log('');
            console.log('📝 Next Steps:');
            console.log('   1. Make sure frontend is restarted (Ctrl+C, then npm run dev)');
            console.log('   2. Open incognito window');
            console.log('   3. Go to http://localhost:5173');
            console.log('   4. Login with above credentials');
            console.log('');
        } else {
            console.log('⚠️  Password not updated (maybe already set to this value?)');
        }
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    } finally {
        await client.close();
    }
}

resetPassword();
