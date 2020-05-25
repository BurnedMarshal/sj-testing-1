const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const {check, validationResult} = require('express-validator/check');

const User = require('../models/users');

// INDEX
router.get('/', function(req, res) {
  User.find(function(err, users) {
    if (err) return res.status(500).json({error: err});
    res.json(users);
  });
});
// SHOW GET: /users/:id
router.get('/:id', function(req, res) {
  User.findOne({_id: req.params.id}, function(err, user) {
    if (err) return res.status(500).json({error: err});
    if (!user) return res.status(404).json({message: 'Utente non trovato'});
    res.json(user);
  });
});

// CREATE
router.post('/', [
  check('fullname').exists(),
  check('email').isEmail(),
  check('age').isInt(),
],
function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  const nameParts = req.body.fullname.split(' ');
  const userParams = {
    name: nameParts[0],
    surname: nameParts[1],
    age: req.body.age,
    email: req.body.email,
  };
  const newUser = new User(userParams);
  newUser.save(function(err) {
    if (err) return res.status(500).json({error: err});
    res.status(201).json(newUser);
  });
});

// EDIT
router.put('/:id', function(req, res) {
  User.findOne({_id: req.params.id})
      .exec(function(err, user) {
        if (err) return res.status(500).json({error: err});
        if (!user) {
          return res.status(404).json({message: 'Utente non trovato'});
        }
        for (key in req.body) {
          if (req.body.hasOwnProperty(key)) {
            user[key] = req.body[key];
          }
        }
        user.save(function(err) {
          if (err) return res.status(500).json({error: err});
          res.json(user);
        });
      });
});

// REMOVE
router.delete('/:id', function(req, res) {
  User.findOne({_id: req.params.id})
      .exec(function(err, user) {
        if (err) return res.status(500).json({error: err});
        if (!user) return res.status(404).json({message: 'Utente non trovato'});
        User.remove({_id: req.params.id}, function(err) {
          if (err) return res.status(500).json({error: err});
          res.json({message: 'Utente eliminato correttamente'});
        });
      });
});

module.exports = router;
