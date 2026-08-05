/**
 * Quick Script to Add Email & Comments to Test Candidates
 * Run this once to add test data to your selected candidates
 */

const mongoose = require('mongoose');

// Connect to your MongoDB
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Your Candidate/Job model (adjust the path to your actual model)
const Candidate = require('./models/Candidate'); // or Job model

async function addTestData() {
  try {
    console.log('🔄 Adding test data to candidates...');

    // Update the 3 candidates you see in the screenshot
    const updates = [
      {
        id: '696cb175c2b8b04848f4a39a', // First candidate ID from screenshot
        email: 'rahul.developer@gmail.com',
        comments: ''
      },
      {
        id: '696ce4cf2c61b162ca3fe77a3b', // Second candidate ID
        email: 'priya.dev@gmail.com',
        comments: ''
      },
      {
        id: '696cb1f65c2a6ab48b84aa8c', // Third candidate ID
        email: 'amit.frontend@gmail.com',
        comments: ''
      }
    ];

    for (const update of updates) {
      await Candidate.findByIdAndUpdate(
        update.id,
        {
          email: update.email,
          comments: update.comments
        }
      );
      console.log(`✅ Updated candidate ${update.id} with email: ${update.email}`);
    }

    console.log('🎉 Test data added successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addTestData();
