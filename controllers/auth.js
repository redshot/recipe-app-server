const User = require('../models/user') // import the user model
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail') // sendgrid
const { expressjwt: expressjwt } = require('express-jwt');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.signup = (req, res) => {
  const {name, email, password} = req.body; // shows the data send on terminal
  const saveNewUser = async () => {
    try {
      let findUser = await User.findOne({ email }); // promise is the new way of doing this instead of callback as of express 4.18 and mongoose 7.0.3
      let newUser = new User({name, email, password}) // instantiate the user model imported above.
  
      if (findUser) {
        return res.status(400).json({
          error: 'Email is taken'
        }) // This return statement will hinder the code below from being executed if this condition is true
      }

      const token = jwt.sign({name, email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '10m'})
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Account activation link`,
        html: `
          <h1>Please use the following link to activate your account</h1>
          <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
          <hr />
          <p>This email may contain sensitive information</p>
          <p>${process.env.CLIENT_URL}</p>
        `
      }

      await sgMail.send(emailData)

      //await newUser.save() // promise is the new way of doing this instead of callback as of express 4.18

      //return res.json({ message: 'Signup sucess! Please signin'})
    
      // there should always be a return inside async
      return res.json({
        message: `Email has been sent to ${email}. Follow the instruction to activate your account`
      })
    } catch(error) {
      console.log('SIGNUP ERROR', error)

      return res.status(400).json({
        error: error
      })  
    }
  };

  saveNewUser();
}

exports.accountActivation = (req, res) => {
  const { token } = req.body;
  const activateAccount = async () => {
    try {
      if (token) {
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
          if (err) {
            console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);
    
            return res.status(401).json({
              error: 'Expired link. Signup again'
            });
          }
        });
      }

      const { name, email, password } = jwt.decode(token);
      const user = new User({ name, email, password });

      await user.save(); 

      return res.json({
        message: 'Signup success. Please signin.'
      });
    } catch(error) {
      return res.status(400).json({
        error: error
      });
    }
  };

  /*
  if (token) {
    jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
      if (err) {
        console.log('JWT VERIFY IN ACCOUNT ACTIVATION ERROR', err);

        return res.status(401).json({
          error: 'Expired link. Signup again'
        });
      }

      const { name, email, password } = jwt.decode(token);
      const user = new User({ name, email, password });

      user.save((err, user) => {
        if (err) {
          console.log('SAVE USER IN ACCOUNT ACTIVATION ERROR', err);

          return res.status(401).json({
            error: 'Error saving user in database. Try signup again'
          });
        }

        return res.json({
          message: 'Signup success. Please signin.'
        })
      });
    });
  } else {
    return res.json({
      message: 'Something went wrong. Try again.'
    });
  }
  */

  activateAccount();
}

exports.signin = (req, res) => {
  const { email, password } = req.body;
  const signInUser = async () => {
    try {
      // Check if user exists
      let findUser = await User.findOne({ email }); // promise is the new way of doing this instead of callback as of express 4.18 and mongoose 7.0.3

      if (!findUser) {
        return res.status(400).json({
          error: 'User with that email does not exist. Please signup'
        });
      }

      // authenticate
      if (!findUser.authenticate(password)) { // authenticate() is part of the User schema model
        return res.status(400).json({
          error: 'Email and password do not match'
        });
      }

       // generate a token and send to client
      const token = jwt.sign({_id: findUser._id}, process.env.JWT_SECRET, { expiresIn: '7d' }); // we can set this 1m(1 minute) to test expiry
      const {_id, name, role} = findUser; // email is remove in this line because of cannot access 'email' before initialization? error

      return res.json({
        token, // can be written as token: token
        findUser: { _id, name, email, role }
      });
    } catch (error) {
      console.log(error); // Sometimes this error is not displayed on postman

      return res.status(400).json({
        error: 'Something went wrong'
      });
    }
  }

  /*
  // Check if user exists
  User.findOne({email}).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please signup'
      })
    }

    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match'
      })
    }

    // generate a token and send to client
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, { expiresIn: '7d' });
    const {_id, name, email, role} = user;

    return res.json({
      token,
      user: { _id, name, email, role}
    });
  });
  */

  signInUser();
};

exports.requireSignin = expressjwt({ // adds a req.user/req.auth property to the request object
  secret: process.env.JWT_SECRET, 
  algorithms: ['HS256']
});

exports.adminMiddleware = (req, res, next) => {
  // console.log('req.auth: ', req.auth);
  const restrictUser = async () => {
    try {
      let findUser = await User.findById({ _id: req.auth._id }); // promise is the new way of doing this instead of callback as of express 4.18 and mongoose 7.0.3
      // console.log('findUser: ', findUser);

      if (!findUser) {
        return res.status(400).json({
          error: 'User not found'
        });
      }

      if (findUser.role !== 'admin') {
        return res.status(400).json({
          error: 'Admin resource. Access denied.'
        });
      }
      req.profile = findUser; // req.profile contains the user record that was not yet updated
      next();
    } catch(error) {
      console.log('Admin Middleware Error', error);
  
      return res.status(400).json({
        error: 'Admin Middleware Error'
      })  
    }
  };

  restrictUser();
};

exports.forgotPassword = (req, res) => {
  const {email} = req.body;
  const sendEmailForgotPassword = async () => {
    try {
      let findUser = await User.findOne({ email }); // promise is the new way of doing this instead of callback as of express 4.18 and mongoose 7.0.3
  
      if (!findUser) {
        return res.status(400).json({
          error: 'User with that email does not exist'
        });
      }

      const token = jwt.sign({_id: findUser._id}, process.env.JWT_RESET_PASSWORD, {expiresIn: '10m'})
      const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Password Reset link`,
        html: `
          <h1>Please use the following link to reset your password</h1>
          <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
          <hr />
          <p>This email may contain sensitive information</p>
          <p>${process.env.CLIENT_URL}</p>
        `
      }

      await sgMail.send(emailData);

      return res.json({
        message: `Email has been sent to ${email}. Follow the instruction to activate your account`
      })      
    } catch(error) {
      console.log('FORGOT PASSWORD ERROR', error)

      return res.status(400).json({
        error: error
      })  
    }
  };

  sendEmailForgotPassword();
};

exports.resetPassword = (req, res) => {
  //
};

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
 * The signup functionality uses the email confirmation concept. Below is the Email confirmation workflow
 *  - When they want to signup, we will send them an email(if email not existing in db)
 *  - If they used valid email(not existing in db) only then they will be able to see the confirmation.
 *  - On that email we will send the user signup information encoded in jwt. There will also be a url link
 *  - Upon clicking on that url, they will be taken to client/react app where we will grab the encoded jwt which contains user info
 *  - Then we make a request to backend using our react app so that user is finally saved in the database 
 * Sendgrid is used to send the user an email and encode the jwt
 *  - We can use .then of ES6 or asnyc await of ES6 - https://www.npmjs.com/package/@sendgrid/mail
 * A rule of thumb is to never combine await and then in a function
 * user.save() is converted into async and wait because of "throw new MongooseError('Model.prototype.save() no longer accepts a callback');"
 *  - await user.save(); should be outside if statement otherwise it will prompt "await is only valid in async functions and the top level bodies of modules"
 * signup and accountActivation is exported from the routes file hence there is a exports.signup and exports.accountActivation
 * 
 *  How signin works
 *  - Check if user is trying to signin but haven't signed up yet
 *  - Check if password matches by taking the password then convert it to a hashed password and compare it with the password saved in db
 *  - if yes, generate token with expiry
 *  - the token will be sent to client/react
 *  - it will be used as jwt based authentication system
 *  - we can allow user to access protected routes later if they have valid token
 *  - so jwt token is like password with expiry
 *  - in success signin we will send user info and valid token
 *  - this token will be sent back to server from client/react to access protected routes
 * 
 * - Code flow for exports.adminMiddleware = (req, res, next) {}:
 *  - Apply the requireSignin is applied in the user route. For example: router.put('/admin/update', requireSignin, update);
 *    - The requireSignin middleware will give us the req.user/req.auth id property
 *  - The id property will be used to query in the database
 *  - Check if the role is admin. The API/Update request will be denied if the role is not admin
 *  - Update the user in the db. The update method in routes/user.js will be invoked by the next() function of adminMiddleware
 * 
 * - The next() function is not a part of the Node.js or Express API, but is the third argument that is passed to the 
 *   middleware function. Source: https://expressjs.com/en/guide/writing-middleware.html
 * 
 * - Code flow for exports.forgotPassword = (req, res) {}:
 *  - Find user in the db if user is existing
 *  - If user is existing, generate a token and send an email to the user we just searched
 * 
 */