const User = require('../models/user') // import the user model

exports.signup = (req, res) => {
  const{name, email, password} = req.body // data is available from the req.body. We can destructure the data {name, email, password} from req.body
  const saveNewUser = async () => {
    try {
      let findUser = await User.findOne({ email }); // promise is the new way of doing this instead of callback as of express 4.18
      let newUser = new User({name, email, password}) // instantiate the user model imported above.
  
      if (findUser) {
        return res.status(400).json({
          error: 'Email is taken'
        })
      }
    
      await newUser.save(); // promise is the new way of doing this instead of callback as of express 4.18
  
      return res.json({ message: 'Signup sucess! Please signin'})
    } catch(error) {
      console.log('SIGNUP ERROR', error)

      return res.status(400).json({
        error: error
      })  
    }
  }

  /*
  // this is the original way of doing it but this shows a deprecated error
  User.findOne({email}).exec((err, user) => {
    if (user) {
      return res.status(400).json({
        error: 'Email is taken'
      })
    }
  })
  */

  /*
  // this is the original way of doing it but this shows a deprecated error
  newUser.save((err, success) => {
    if (err) {
      console.log('SIGNUP ERROR', err)

      return res.status(400).json({
        error: err
      })
    }

    res.json({
      message: 'Signup sucess! Please signin'
    })
  })
  */

  console.log('REQ BODY ON SIGNUP', req.body) // shows the data send on terminal
  saveNewUser();
}

/**
 * We are going to take all the user information then send them an email and only when they click the email the account is created for them.
 *  - We are doing this to avoid spam users
 * We will first make sure that the new user that will be saved in the database is not existing through User.findOne({email})
 *  - .findOne is a mongoose method. .findOne() will stop as soon as it finds as compared to .find() where it continues to search for all the records.
 *  - We can use a callback function within .exec() function. 
 *  - .success contains the user information if saved successfully
 * User.findOne({ email }) and newUser(variable) got converted into async/promises because of "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client"
 *  - I think what happened is that newUser is also invoked at the same time with User.findOne({ email })
 *  
 * 
 */