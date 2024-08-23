const mongoose = require('mongoose')


const connectDB = async () =>{
    mongoose.connect(process.env.MONGODB_URI, 
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