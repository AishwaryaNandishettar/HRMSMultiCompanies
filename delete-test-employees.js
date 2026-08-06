/**
 * Delete Test Employees from MongoDB Atlas
 * This removes the test employees (Rahul Sharma, Silk Smitha, etc.) from your cloud database
 * 
 * RUN THIS:
 * node delete-test-employees.js
 */

const { MongoClient } = require('mongodb');

// Your MongoDB Atlas connection
const uri = 'mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0';

async function deleteTestEmployees() {
    console.log('🗑️  Deleting test employees from MongoDB Atlas...\n');
    
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB Atlas\n');
        
        const db = client.db('Data_base_hrms');
        const collection = db.collection('employees');
        
        // List of test employee IDs to delete
        const testEmployeeIds = ['EMP101', 'EMP102', 'EMP103', 'EMP105'];
        
        console.log('Employees to delete:');
        const testEmployees = await collection.find({
            employeeId: { $in: testEmployeeIds }
        }).toArray();
        
        testEmployees.forEach(emp => {
            console.log(`  ❌ ${emp.fullName} (${emp.employeeId})`);
        });
        
        console.log('');
        
        // Delete test employees
        const result = await collection.deleteMany({
            employeeId: { $in: testEmployeeIds }
        });
        
        console.log(`✅ Deleted ${result.deletedCount} test employees\n`);
        
        // Show remaining employees
        console.log('Remaining employees:');
        const remainingEmployees = await collection.find({}).toArray();
        
        remainingEmployees.forEach(emp => {
            console.log(`  ✅ ${emp.fullName} (${emp.employeeId}) - ${emp.department}`);
        });
        
        console.log('');
        console.log(`Total employees now: ${remainingEmployees.length}`);
        console.log('');
        console.log('✅ DONE! Refresh your browser to see the changes.');
        console.log('   Press Ctrl+Shift+R on: http://localhost:5173/employee-card');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
    }
}

deleteTestEmployees();
