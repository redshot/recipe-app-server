const User = require('../models/user');

exports.read = (req, res) => {
  const userId = req.params.id;

  /*
  User.findById(userId).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });

      res.json(user);
    }
  });
  */

  const getUserProfile = async () => {
    try {
      let user = await User.findById(userId); // promise is the new way of doing this instead of callback as of mongoose version 7.0.3
  
      if (!user) {
        return res.status(400).json({
          error: 'User not found'
        });
      }

      user.hashed_password = undefined; // set to undefined to hide the field
      user.salt = undefined; // set to undefined to hide the field
  
      return res.json(user);
    } catch(error) {
      console.log(error)
  
      return res.status(400).json({
        error: error
      })  
    }
  }

  getUserProfile();
}

/**
 * - We can also use let user = await User.findOne({ _id: userId }); instead of let user = await User.findById(userId);
 * 
 */