const users = require('../models/userModel');

module.exports = fetchUsers = async (req, res) => {    
  try {
    // Fetch all users from the database
    const allUsers = await users.find(); 

    // Check if there are users in the database
    if (allUsers.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Return the list of users as a JSON response
    res.status(200).json({
        success: true,
        data: allUsers,
        error: false
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
