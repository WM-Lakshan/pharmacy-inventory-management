const express = require('express');
const router = express.Router();
const SearchController = require('../../Controllers/customer/search.controller');

// Search products
router.get('/search', SearchController.searchProducts);

// Get product details
router.get('/productsDetails/:id', SearchController.getProductDetails);

// Get related products
router.get('/productsDetails/related/:id', SearchController.getRelatedProducts);

module.exports = router;