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

exports.update = (req, res) => {
  console.log('UPDATE USER - req.auth', req.auth, 'UPDATE DATA', req.body);
  const {name, password} = req.body;

  /*
  User.findOne({_id: req.user._id}, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found'
      });
    }

    if (!name) {
      return res.status(400).json({
        error: 'Name is required'
      });
    } else {
      user.name = name;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          error: 'Password should be min 6 characters long'
        });
      } else {
        user.password = password;
      }
    }

    user.save((err, updatedUser) => {
      if (err) {
        console.log('USER UPDATE ERROR', err);
        return res.status(400).json({
          error: 'User update failed'
        });
      }

      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;

      res.json(updatedUser);
    });
  });
  */

  const updateUser = async () => {
    try {
      let findUser = await User.findOne({_id: req.auth._id}); // promise is the new way of doing this instead of callback as of express 4.18
      console.log('findUser', findUser);

      if (!findUser) {
        return res.status(400).json({
          error: 'User not found'
        });
      }

      // console.log('name: ', name, 'findUser: ', findUser.name);
  
      if (!name) {
        return res.status(400).json({
          error: 'Name is required'
        });
      } else {
        findUser.name = name;
      }

      if (password) {
        if (password.length < 6) {
          return res.status(400).json({
            error: 'Password should be min 6 characters long'
          });
        } else {
          findUser.password = password;
        }
      }
  
      let updatedUser =  await User.findByIdAndUpdate(req.auth._id, {
          name: findUser.name
        },
        {new: true}
      );

      updatedUser.hashed_password = undefined;
      updatedUser.salt = undefined;

      return res.json(updatedUser);
    } catch(error) {
      console.log('USER UPDATE ERROR', error)

      return res.status(400).json({
        error: 'User update failed'
      })  
    }
  }

  updateUser();
}

/**
 * - The req.user/req.auth data became available because of requireSignin middleware
 * - We can also use let user = await User.findOne({ _id: userId }); instead of let user = await User.findById(userId);
 * - We used req.auth instead of req.user in console.log('UPDATE USER - req.auth', req.auth, 'UPDATE DATA', req.body);
 *  because req.user would display as undefined
 * - Code flow for exports.update = (req, res) => {}:
 *  - Get the user ID from the req.user/req.auth
 *  - Find the user in the database based on the user ID and update his/her profile
 *    - Optional: Signin first in postman - http://localhost:8000/api/signin to get the token
 *      - Use the token in http://localhost:8000/api/user/update as Authorization parameter
 *  - Save the user in the database
 *    - Note: The findByIdAndUpdate() method is not final. We just used it for the sake of the following the tutorial.
 */