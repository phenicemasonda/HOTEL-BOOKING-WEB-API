const Product = require('../../models/product');
const Category = require('../../models/category');
const User = require('../../models/user');
const express = require('express');
const router = express.Router();
const multer = require('multer');



const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
  } 
  
   const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const isValid = FILE_TYPE_MAP[file.mimetype];
      cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.split(' ').join('-');
      const extension = FILE_TYPE_MAP[file.mimetype];
      cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
   }
   )
const uploadOptions = multer({ storage: storage })
 

 


router.get('/products', async (req, res) =>{

    try {
 
        let categories = await Category.find()
        let productList = await Product.find() 

        res.render('user/products', {categories, productList})
    } catch (error) {
        res.render('404Error', {error})
    }
})


router.get('/product', async (req, res) =>{

    try {       
        let productList = await Product.find() 

        res.render('admin/product', {productList})
    } catch (error) {
        res.render('404Error', {error})
    }
})


//  Add new Suite to database

router.post(`/addSuite`, uploadOptions.single('image'),  async (req, res) =>{

    try{
    let categories = await Category.find()

    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
       
    let product = new Product({
        
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: `${basePath}${fileName}`, 
        categoryId : req.body.categoryId,
        dateCreated:  Date.now()   
    })
     await product.save();

     let productList = await Product.find()

     res.render('admin/product', {categories, productList})
     
    }catch(error){
        let categories = await Category.find()
        let productList = await Product.find()
        res.render('addSuite', {message:'', error:'Internal error. Suite could not be added',categories, productList})
    } 
}) 
 

 
router.get('/addSuite', async (req, res) => {
    
    let categories = await Category.find()
    let productList = await Product.find()
   
    res.render('addSuite', {message:'', error:'', categories, productList})
  })


  router.get('/editSuite/:productId', async (req, res) => {

    let productId = req.params.productId;
    let categories = await Category.find();
    // let productList = await Product.find();
   
    res.render('editSuite', {categories, productId})
  })

  router.get('/editSuite', async (req, res) => {
   
    res.render('/editSuite')
  })

  router.post('/editSuite/:productId', uploadOptions.single('image'), async (req, res) => {

    try {
    let categories = await Category.find()
   
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    
    const productId = req.params.productId

    const product = await Product.findByIdAndUpdate(productId, {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: `${basePath}${fileName}`,
        categoryId: req.body.categoryId,
    })

    let productList = await Product.find()
        res.render('admin/product', {categories, productList})

    }catch(error) {
        res.render('404Error', {error})
    } 
    

  })




router.get('/product-by-category/:id', async(req, res) => {

    try{
        const categories = await Category.find()   
        const categoryId = req.params.id
        const category = await Category.findById(categoryId)
        const userId = req.session.user;
        const user = await User.findById(userId)
        const productList = await Product.find( {categoryId: categoryId})

        res.render('product-by-category', {productList, user, userId, category, categories})

        }catch(error) {
             res.render('404Error', {error})
      
  }

})

router.post('/deleteSuite/:productId', async(req, res) => {
    const productId = req.params.productId;
    const userId = req.user;

    try {
      
        await Product.findByIdAndDelete(productId)
        const productList = await Product.find()
        res.render('admin/product', {productList, userId})
    }
    catch (error) {
        res.render('404Error', {error})
    }
   

})
 

module.exports = router;