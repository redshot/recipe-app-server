const User = require('../models/user') // import the user model
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail') // sendgrid

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.signup = (req, res) => {
  const {name, email, password} = req.body; // shows the data send on terminal
  const saveNewUser = async () => {
    try {
      let findUser = await User.findOne({ email }); // promise is the new way of doing this instead of callback as of express 4.18
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
 * The signup functionality uses the email confirmation concept.(Email confirmation workflow)
 *  - When they want to signup, we will send them an email
 *  - If they used valid email(not existing in db) only then they will be able to see the confirmation.
 *  - On that email we will send the user signup information encoded in jwt. There will also be a url link
 *  - Upon clicking on that url, they will taken to our clint/react app where we will grab the encoded jwt which contains user info
 *  - Then we make a request to backend using our react app so that user is finally saved in the database 
 * Sendgrid is used to send the user an email and encode the jwt
 *  - We can use .then of ES6 or asnyc await of ES6 - https://www.npmjs.com/package/@sendgrid/mail
 * 
 * A rule of thumb is to never combine await and then in a function
 * 
 */