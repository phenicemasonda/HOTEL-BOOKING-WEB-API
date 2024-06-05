const express = require('express');
const router = express.Router();
const Product = require('../../models/product');

router.get('/', async (req, res) => {
  
   
     try {
       const productList = await Product.find()
   
       res.render('index', {productList,  currentRoute: '/'})
        
       } catch (error) {
       res.render('404Error', {error})
   }
   })


module.exports = router;
