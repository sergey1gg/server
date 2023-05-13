const {Schema,model}=require('mongoose')

const Directory = new Schema({
   rooms: {
     type: [{
       name: String,
       options: [String]
     }],

   },
   elements: {
     type: [{
       name: String,
       options: [String]
     }],
    
   },
   otdelka: {
     type: [{
       name: String,
       options: [String]
     }],
     
   },
   defects: {
     type: [{
       name: String,
       options: [String]
     }],
    
   },
   subdefects: {
     type: [{
       name: String,
       options: [String]
     }],
     
   },
})

module.exports =model('Directory', Directory)
