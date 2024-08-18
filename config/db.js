const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const connectDB = async () =>{
    mongoose.connect(`mongodb+srv://gospel:regX1aDbCYwZnOfQ@cluster0.capnoqm.mongodb.net/HOTEL_DB`, 
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