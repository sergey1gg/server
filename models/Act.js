const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const Act = new mongoose.Schema({
    date:{type: Date},
    number: {type: String},
    FIO: {type: String},
    address:{type: String},
    category: {type: String},
    checkdate: {type: String},
    author:{type: ObjectId, ref:"User"},
    rooms: [{
      name: String,
      items: [{
        name: String,
        otdelka: [{
          name: String,
          troubles: [{
            name: String,
            subDefects: [{
              name: String,
              comment: String
            }]
          }]
        }]
      }]
    }]
  });
  module.exports = mongoose.model('Act', Act);
  