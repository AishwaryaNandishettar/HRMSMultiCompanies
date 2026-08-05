// Check user password in database
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = 'mongodb://localhost:27017';
const dbName = 'Data_base_hrms';
const email = 'Aishwarya@company.com';

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║   CHECK USER PASSWORD                             ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

async function checkUser() {
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB\n');
        
        const db = client.db(dbName);
        const user = await db.collection('users').findOne({ email: email });
        
        if (!user) {
            console.log('❌ User not found:', email);
            return;
        }
        
        console.log('✅ User found:');
        console.log('   Email:', user.email);
        console.log('   Name:', user.name);
        console.log('   Role:', user.role);
        console.log('   CompanyId:', user.companyId);
        console.log('   Active:', user.active);
        console.log('   Password hash:', user.password ? user.password.substring(0, 20) + '...' : 'NOT SET');
        console.log('');
        
        // Test some common passwords
        const testPasswords = ['password', 'admin', 'admin123', 'test', '12345', 'Aishwarya'];
        
        console.log('Testing common passwords:');
        for (const pwd of testPasswords) {
            const match = await bcrypt.compare(pwd, user.password);
            if (match) {
                console.log(`✅ PASSWORD FOUND: "${pwd}"`);
            }
        }
        console.log('');
        
        console.log('If none matched, ask the user what password they are using.');
        
    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
    } finally {
        await client.close();
    }
}

checkUser();
