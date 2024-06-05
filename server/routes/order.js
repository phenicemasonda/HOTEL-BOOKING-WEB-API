
const Order = require('../../models/order');
const express = require('express');;
const router = express.Router();



router.get('/order', (req, res) => { 
    try {
        res.render('order')
    }catch (error) {
    res.render('404Error', {error})

  }
   
 
})

 
module.exports = router;

