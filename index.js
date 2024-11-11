const express = require('express')
const ejs = require('ejs');
const bodyparser = require('body-parser')
const app = new express()
const dotenv = require('dotenv')

dotenv.config()

const connectDB = require('./config/db')
connectDB();



const isActiveRoute = require('./config/routeHelpers')
app.locals.isActiveRoute = isActiveRoute;


app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(express.static('public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.set('view engine','ejs');


app.use('/', require('./server/routes/session'))
app.use('/', require('./server/routes/user'))
app.use('/', require('./server/routes/product'))
app.use('/', require('./server/routes/order'))
app.use('/', require('./server/routes/category'))
app.use('/', require('./server/routes/routes'))
app.use('/', require('./server/routes/bookings'))
app.use('/', require('./server/routes/index'))
 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
}); 
  
 
 


     












 