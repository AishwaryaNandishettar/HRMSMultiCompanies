// ========================================================
// VERIFY DEPLOYMENT READY - Check Everything Before Deploy
// ========================================================

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0';

console.log('\n╔═══════════════════════════════════════════════════╗');
console.log('║   VERIFY DEPLOYMENT READY - Pre-Deploy Check     ║');
console.log('╚═══════════════════════════════════════════════════╝\n');

async function verifyDeploymentReady() {
    let allChecks = true;
    
    console.log('═══════════════════════════════════════════════════');
    console.log('1️⃣  CHECKING FRONTEND CONFIGURATION');
    console.log('═══════════════════════════════════════════════════\n');
    
    // Check .env.production
    const envProdPath = path.join(__dirname, 'HRMS-Frontend', '.env.production');
    try {
        const envProd = fs.readFileSync(envProdPath, 'utf8');
        console.log('✅ .env.production exists');
        
        if (envProd.includes('VITE_TENANT_ID=\n') || envProd.includes('VITE_TENANT_ID=\r\n') || envProd.includes('VITE_TENANT_ID= ')) {
            console.log('✅ VITE_TENANT_ID is empty (correct!)');
        } else if (envProd.includes('VITE_TENANT_ID=')) {
            const match = envProd.match(/VITE_TENANT_ID=(.+)/);
            if (match && match[1].trim()) {
                console.log('❌ VITE_TENANT_ID has value: ' + match[1].trim());
                console.log('   FIX: Set VITE_TENANT_ID= (empty) in .env.production');
                allChecks = false;
            } else {
                console.log('✅ VITE_TENANT_ID is empty (correct!)');
            }
        } else {
            console.log('✅ VITE_TENANT_ID not in file (correct!)');
        }
        
        if (envProd.includes('latestfinalhrmsapplication.onrender.com')) {
            console.log('✅ VITE_API_BASE_URL points to Render backend');
        } else {
            console.log('⚠️  VITE_API_BASE_URL might not point to Render');
            console.log('   Check: Should be https://latestfinalhrmsapplication.onrender.com');
        }
    } catch (err) {
        console.log('❌ .env.production not found: ' + err.message);
        allChecks = false;
    }
    
    // Check vercel.json
    const vercelJsonPath = path.join(__dirname, 'HRMS-Frontend', 'vercel.json');
    try {
        const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
        console.log('\n✅ vercel.json exists');
        
        if (vercelJson.build?.env?.VITE_API_BASE_URL) {
            console.log('✅ vercel.json has VITE_API_BASE_URL: ' + vercelJson.build.env.VITE_API_BASE_URL);
        }
        
        if (vercelJson.build?.env?.VITE_TENANT_ID) {
            console.log('❌ vercel.json has VITE_TENANT_ID - should NOT exist');
            console.log('   FIX: Remove VITE_TENANT_ID from vercel.json');
            allChecks = false;
        } else {
            console.log('✅ vercel.json has NO VITE_TENANT_ID (correct!)');
        }
    } catch (err) {
        console.log('❌ vercel.json error: ' + err.message);
        allChecks = false;
    }
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('2️⃣  CHECKING DATABASE (MONGODB ATLAS)');
    console.log('═══════════════════════════════════════════════════\n');
    
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas');
        
        const db = client.db('Data_base_hrms');
        
        // Check users
        const usersWithCompanyId = await db.collection('users').countDocuments({
            companyId: { $exists: true, $ne: null, $ne: '' }
        });
        const totalUsers = await db.collection('users').countDocuments();
        
        if (usersWithCompanyId === 0) {
            console.log(`✅ Users: ${totalUsers} total, 0 with companyId (correct!)`);
        } else {
            console.log(`❌ Users: ${usersWithCompanyId}/${totalUsers} still have companyId`);
            console.log('   FIX: Run "node revert-companyid.js"');
            allChecks = false;
        }
        
        // Check employees
        const employeesWithCompanyId = await db.collection('employees').countDocuments({
            companyId: { $exists: true, $ne: null, $ne: '' }
        });
        const totalEmployees = await db.collection('employees').countDocuments();
        
        if (employeesWithCompanyId === 0) {
            console.log(`✅ Employees: ${totalEmployees} total, 0 with companyId (correct!)`);
        } else {
            console.log(`❌ Employees: ${employeesWithCompanyId}/${totalEmployees} still have companyId`);
            console.log('   FIX: Run "node revert-companyid.js"');
            allChecks = false;
        }
        
        // Check admin user exists
        const admin = await db.collection('users').findOne({
            email: 'Aishwarya@company.com'
        });
        
        if (admin) {
            console.log('✅ Admin user exists: Aishwarya@company.com');
            if (admin.companyId) {
                console.log(`   ⚠️  Admin has companyId: ${admin.companyId}`);
                console.log('   FIX: Run "node revert-companyid.js"');
                allChecks = false;
            } else {
                console.log('   ✅ Admin has NO companyId (correct!)');
            }
        } else {
            console.log('❌ Admin user not found: Aishwarya@company.com');
            allChecks = false;
        }
        
    } catch (error) {
        console.log('❌ Database check failed: ' + error.message);
        allChecks = false;
    } finally {
        await client.close();
    }
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('3️⃣  CHECKING BACKEND CONFIGURATION');
    console.log('═══════════════════════════════════════════════════\n');
    
    const appPropsPath = path.join(__dirname, 'src', 'main', 'resources', 'application.properties');
    try {
        const appProps = fs.readFileSync(appPropsPath, 'utf8');
        
        if (appProps.includes('mongodb+srv://') || appProps.includes('mongodb://')) {
            console.log('✅ Backend configured with MongoDB connection');
            
            if (appProps.includes('mongodb+srv://hrms_user:')) {
                console.log('✅ Backend uses MongoDB Atlas (correct!)');
            } else {
                console.log('⚠️  Backend might use local MongoDB');
            }
        } else {
            console.log('❌ MongoDB connection not found in application.properties');
            allChecks = false;
        }
    } catch (err) {
        console.log('❌ application.properties check failed: ' + err.message);
    }
    
    // Final Summary
    console.log('\n═══════════════════════════════════════════════════');
    console.log('4️⃣  DEPLOYMENT READINESS SUMMARY');
    console.log('═══════════════════════════════════════════════════\n');
    
    if (allChecks) {
        console.log('✅✅✅ ALL CHECKS PASSED! ✅✅✅');
        console.log('');
        console.log('🚀 YOU ARE READY TO DEPLOY TO VERCEL!');
        console.log('');
        console.log('Next steps:');
        console.log('1. Commit changes: git add . && git commit -m "Ready for deployment"');
        console.log('2. Push to GitHub: git push origin main');
        console.log('3. Vercel will auto-deploy in 2-3 minutes');
        console.log('4. Test login on Vercel URL');
        console.log('');
        console.log('OR use Vercel CLI:');
        console.log('   cd HRMS-Frontend && vercel --prod');
    } else {
        console.log('❌ SOME CHECKS FAILED');
        console.log('');
        console.log('Please fix the issues above before deploying.');
        console.log('Common fixes:');
        console.log('- Remove VITE_TENANT_ID from .env.production');
        console.log('- Remove VITE_TENANT_ID from vercel.json');
        console.log('- Run: node revert-companyid.js');
        console.log('');
        console.log('Then run this script again: node verify-deployment-ready.js');
    }
    
    console.log('\n═══════════════════════════════════════════════════\n');
}

verifyDeploymentReady().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
