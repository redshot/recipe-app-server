const {check} = require('express-validator')

exports.userSignupValidator = [
  check('name')
    .not()
    .isEmpty()
    .withMessage('Name is required'),
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  check('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters long')
];

exports.userSigninValidator = [
  check('email')
    .isEmail()
    .withMessage('Must be a valid email address'),
  check('password')
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters long')
];

exports.forgotPasswordValidator = [
  check('email')
    .not()
    .isEmpty()
    .isEmail()
    .withMessage('Must be a valid email address')
];

exports.resetPasswordValidator = [
  check('newPassword')
    .not()
    .isEmpty()
    .isLength({min: 6})
    .withMessage('Password must be at least 6 characters long')
];

/**
 * - What Is Express Validator?
 *  - Express Validator is an Express middleware library that you can incorporate in your apps for server-side data validation.
 *  - Why Server-Side Validation?
 *    - For example, your servers have no means to know if a malicious user (or virus) disabled front-end validation
 *      (e.g., JavaScript) to allow the app to submit bogus data to your server. That is, client-side validation is not enough.
 *  - Source: https://auth0.com/blog/express-validator-tutorial/
 * - 
 */