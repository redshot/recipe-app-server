exports.signup = (req, res) => {
  console.log('REQ BODY ON SIGNUP', req.body); // shows the sent data on terminal

  res.json({
    data: 'you hit signup endpoint'
  });
}