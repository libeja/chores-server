const User = require('../models/user');

exports.signup = function(req, res, next) {
  const user = new User({
    email: req.body.email,
    name: req.body.name,
    password: req.body.password
  });

// TODO: Send existing email error to client

  // email validation using unique: true in schema
  // from: https://stackoverflow.com/questions/30593882/how-to-catch-the-error-when-inserting-a-mongodb-document-which-violates-an-uniqu
  user.save(function(err, user) {
    if (err) {
     
      // if email already exists
      if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(422).send({ error: 'Email is in use' });

      // Validation error when required field is not submitted  
      } else if (err.name === 'ValidationError' && err.errors.password.kind === 'required') {
        return res.status(422).send({ error: 'No password supplied' });
      }
      
    } else {
      return res.status(200).send({ message: 'User has been created', user: user });
    }
  });
}