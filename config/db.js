const mongoose = require('mongoose')

const connectDB = async () =>{
    mongoose.connect('mongodb+srv//gospel:reqX1aDbCYwZnOfQ@cluster0.capnoqm.mongodb.net/HOTEL_DB', 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
.then(()=>{
console.log('Database Connection is ready...')
})
.catch((err)=> {
console.log(err);
})

}
module.exports = connectDB