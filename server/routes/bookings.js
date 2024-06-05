const express = require('express')
const router = express.Router();
const Bookings = require('../../models/bookings');
const Order = require('../../models/order')
const Product = require('../../models/product');


router.get('/bookSuite/:id',  async(req, res) => {

    try {
      if(req.session.booking){
        let bookedSuite = req.session.booking;
        console.log(bookedSuite.items._id)
      }
     const productId = req.params.id
      let booking = new Bookings (req.session.booking ? req.session.booking: {items: {}});
  
      let product = await Product.findById(productId)
      let name = product.name
      let image = product.image
      booking.add(product, productId, name, image);
      req.session.booking = booking;
      res.render('bookedSuite', {products : booking.generateArray(), totalQty: booking.totalQty} ) 
  
    } catch (error) {  
      res.render('404Error', {error})
    } 
    })   
  
 

router.get('/bookings', (req, res) => {  

    try {
      const startDate = new Date(req.query.startDate);
      const endDate = new Date(req.query.endDate);
      let difference = endDate - startDate;
          difference = difference + 86400000;
      const nights = (difference / (1000 * 3600 * 24));
      
      req.session.url = req.url

      if(req.session.user){
        
          if(!req.session.booking) {
            return res.render('bookings', {products: null});
          }

          var booking = new Bookings(req.session.booking)
          let newPrice = booking.totalPrice * nights
          booking.totalPrice = newPrice;
          req.session.totalPrice = booking.totalPrice
          res.render('bookings', {products: booking.generateArray(), totalPrice: booking.totalPrice, totalQty: booking.totalQty, nights})

        }else{
          res.render('login', {message:'User login required', error:'', currentRoute:'/login'})
        }
    }catch(error) {
      res.render('404Error', {error})
        
    }
    })
 
  
 router.get('/checkout', (req, res) => {

    try {
    if(!req.session.booking) {
      return res.redirect('/bookings');
    }
    var booking = new Bookings(req.session.booking)
    // res.render('checkout', {amount: cart.totalPrice})
    res.render('checkout', {amount: req.session.totalPrice, errMsg:'' , noError: ''})
  }catch(error) {
    res.render('404Error', {error})
  }
  })
   
router.post('/checkout', async (req, res) => {
  const PUBLISHABLE_KEY = 'pk_test_51Od966GbDUdT8ZzpfRAgDt1io0zcVmZiCMZxdWTgulE4vVbn0C89piInoPOmO9bulA2tPLdyAl8Qp4tW2vT50jmN00DSsYzTKg';
  const SECRET_KEY = 'sk_test_51Od966GbDUdT8ZzpYNd3Cb6B9P11idL7FUsojm01OEttSYnDfgQSckYuh9aTyRHKcS8sZbSDED2p7EygvlJ8gziS00T9ejKatP';
  
  const stripe = require('stripe') (SECRET_KEY) 
  
  const charge = await stripe.charges.create({
        amount: req.body.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken,
        description: "cart payment"
      }, function(err, charge) {
        if (err) {
          req.flash('error', err.message);
          // return res.redirect('/checkout');
        }
      })  

        order = new Order ({
          user: req.user,
          cart: req.session.cart,
          name: req.body.name,
          address: req.body.address,
          // paymentId: charge.id,
          dateOrdered: Date.now()
        }) 
        await order.save()
         
        req.session.booking = null;
        res.render('checkoutSuccess')
})
  

router.get('/checkoutSuccess', (req, res) => {
  res.render('checkoutSuccess', {successMsg:'', noMessages: ''})
})

router.get('/remita', (req, res) => {
  res.render('remita')
})



router.post('/cancelBooking', async(req, res) => {
  try{
    const userId = req.user
    const productList =  await Product.find()
    req.session.booking = null
    res.render('user/products', {userId, productList})
  } catch (error) {
  res.render('404Error', {error})
  }
})


module.exports = router