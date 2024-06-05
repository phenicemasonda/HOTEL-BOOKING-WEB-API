const express = require('express')
const router = express.Router();
const UserModel = require('../../models/user')
const Order = require('../../models/order')
const Product = require('../../models/product')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Category = require('../../models/category')
const JWT_SECRET = process.env.JWT_SECRET;

 

  
  /*
      * POST /
      * USER - REGISTER
  */
  router.post('/register', async (req, res) => {

    try {     
      const  {username, email, password, confirmPassword} = req.body;
      let user = await UserModel.findOne({email})
  
      const hasAlphabet = /[a-zA-Z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password);

      if (password.length >= 8 && hasAlphabet && hasNumber && hasSpecialChar) {
          if(password !== confirmPassword) {
            return res.render('login', {error: 'Passwords entered do not match', message:'', currentRoute:'/login'})
          }
          user = new UserModel({
            username,
            email,
            password, 
          })
          await user.save() 
          return res.render('login', {message: 'Registration successful', error:'', currentRoute:'/login'}) 
      }   
      else {
       return  res.render('login' ,{error:"Password should be at least 8 characters long and contain a mixture of numbers, alphabets, and special characters.", message:'', currentRoute:'/login'});
      }
    } catch (error) {
      res.render('login', {message: '', error:'', currentRoute:'/login' })
    }
  });
  
  
  /*
      * POST /
      * USER - DASHBOARD
  */
 
  router.post('/login', async (req, res) => {
 

    try {
     const  {email, password} = req.body;
     let user = await UserModel.findOne({email})
 
     if (!user || !user.validPassword(password)) {
       return res.render('index', { message:'' ,error: 'Wrong username or password', currentRoute:'/' });
     }
     let categories = await Category.find()
     let users = await UserModel.find()
     let orders = await Order.find()
 
     const userId = user._id
     req.session.user = user._id
 
 /*   const token = jwt.sign({ userId: userId}, jwtSecret );
      res.cookie('token', token, {httpOnly: true});
  */
      if(user.email === 'ozchange2002@gmail.com') {
       return res.render('admin/adminDashboard', {categories, user, users, orders, userOrders:''});
     } 
    
     req.session.authMiddleware = true
     if(req.session.url) {
      return res.redirect(req.session.url)
     }
 
     res.render('user/dashboard', { categories, user, userOrders:''});
 
   }
        catch (error) {   
       res.render('404Error', {error})
       }
     }); 
 
 

  
  
  /*
      * GET /
      * USER - DASHBOARD
  */
  router.get('/dashboard', async(req, res) => {

    let categories = await Category.find()
    let users = await UserModel.find()
    let orders = await Order.find()
    const user = req.session.user
    try {
      if(req.session.authMiddleware){

        res.render('user/dashboard', {users, categories ,orders, user})
      }else{
        res.render('login', {message:'', error:'User is not logged in or Expired session', currentRoute:'/'})
      }
    } catch (error) {
      res.render('404Error')
    }  
  
  })


  /*
      * GET /
      * USER - DASHBOARD
  */
  router.get('/adminDashboard', async(req, res) => {

    try {
      let categories = await Category.find()
      let users = await UserModel.find()
      let orders = await Order.find()
      const user = req.session.user

      if(req.session.authMiddleware){
        res.render('admin/adminDashboard', {users, categories ,orders, user})
      }else{
        res.render('login', {error:'', message:'User is not logged in or Expired session', currentRoute:'/login'})
      }
    } catch (error) {
      res.render('404Error')
    }  
  })


   


   
  
  
  /*
  * POST /
  * USER -  LOG-OUT
  */
    
   router.post('/logout', (req, res) => {

    if (req.session.cart) {
      req.session.cart = null
    }

   req.session.destroy((err) => {
    if(err) throw err;
    res.redirect('/login')
   });
  }); 
  
  /*
  * GET /
  * LOGIN 
  */
  router.get('/login', (req, res) => {
    try{
      res.render('login', {message:'', error:'', currentRoute: '/login'})
    }catch (error) {
      res.render('404Error', {error})
    }
  
  })

  router.get('/404Error', (req, res) => {
    res.render('404Error', {error} )
  
  })

  
   
router.get('/forgot-password', (req, res) => {
  try {
    res.render('forgot-password', {message:'', error:''})
  }catch(error) {
    res.render('404Error', {error})
      
  }
  
  })
  

router.post('/forgot-password', (req, res) => {

    try {
        const{email}= req.body;
        UserModel.findOne({email: email})
          .then(user => {
  
        if(!user){
        res.render('index', {message:'', error:'User not registered'})
        return
       }
  
      //  console.log(user._id)
      //  console.log(user.password)
  
       const userId = user._id;
  
    //User exist, now create a one time link for 15 minutes
     const secret = JWT_SECRET + userId
    const token = jwt.sign({id: user._id}, secret, {expiresIn: '15m'})
    const link = `http://localhost:5000/reset-password/${userId}/${token}`
  
  
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:  'ozchange2002@gmail.com',
      pass: 'zlrc jbll qgnp uryf'
    }
  });
  
  var mailOptions = {
    from: 'ozchange2002@gmail.com',
    to: email,
    subject: 'RESET PASSWORD',
    text: link,
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
     console.log(link);
    res.render('index', {message:'Password reset link has been sent to your email...', error:'', currentRoute:'/'})  
    
  })
  } catch (error) {
    res.render('404Error', {error})

  }
  })
  
  
  
  
router.get('/reset-password/:id/:token', async (req, res, next) => {
  
    const {id, token} = req.params;
    let user = await UserModel.findById(id)
    const userId = user._id
    
    if(!user) {
      res.render('reset-password',{message:'', error:'Invalid ID'})
      return
    }
  
    // UserID verified
    const secret = JWT_SECRET + userId;
  
    try{
      const payload = jwt.verify(token, secret)
      res.render('reset-password', {email: user.email})
    }
    catch(error) {
      
      res.render('404Error', {error});
    }
   
  })

  
  
router.post('/reset-password/:id/:token', async (req, res, next) => {
  try {
    const {id, token} = req.params;
    let user = await UserModel.findById(id)
  
    const {password, password2} = req.body;
    
    if (password !== password2) {
      return res.render('reset-password', {message:'',error:'Password entered do not match'})
    }
    const userId = user._id;
    const secret = JWT_SECRET + userId;

    jwt.verify(token, secret, (err, decoded) => {
      if(err) {
        return res.render('index',{message:'', error: "Error with token", currentRoute:'/'})
  
      }else {
        let hash = bcrypt.hash(password, 10)
        UserModel.findByIdAndUpdate({_id: id}, {password: hash})
           res.render('index', { message: "Password successfully changed! Go to login page", error:'', currentRoute:'/'})    
        }
      })
      }catch(error) {
          res.render('404Error', {error})
        }
    })




  module.exports = router;