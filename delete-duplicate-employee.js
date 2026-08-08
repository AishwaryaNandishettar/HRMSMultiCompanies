/**
 * Delete Duplicate Employee Record
 * Run this in MongoDB Compass or mongosh
 */

// Connect to your database
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://hrms_user:HRMS%4012345@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0';

async function deleteDuplicateEmployee() {
    const client = new MongoClient(MONGODB_URI);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db('Data_base_hrms');
        const collection = db.collection('employee');
        
        // Find the duplicate employee (created on 2026-08-07)
        const duplicateEmployee = {
            _id: '6a75d2a10d567c5bc4af08fa' // The duplicate record
        };
        
        // Delete it
        const result = await collection.deleteOne({ _id: duplicateEmployee._id });
        
        if (result.deletedCount === 1) {
            console.log('✅ Duplicate employee deleted successfully!');
        } else {
            console.log('⚠️ Employee not found or already deleted');
        }
        
        // Show remaining Aishwarya records
        const remaining = await collection.find({ fullName: 'Aishwarya' }).toArray();
        console.log('\n📋 Remaining Aishwarya records:', remaining.length);
        remaining.forEach((emp, index) => {
            console.log(`\n${index + 1}. Employee ID: ${emp.employeeId}`);
            console.log(`   Email: ${emp.email}`);
            console.log(`   Status: ${emp.status}`);
            console.log(`   Created: ${emp.createdAt}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
    }
}

// Run it
deleteDuplicateEmployee();
