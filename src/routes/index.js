const router = require("express").Router();
const saleController = require("../controllers/salesController");
const sellerController = require("../controllers/sellersController");

router.post('/sellers/:seller_id/add', saleController.create);
router.post('/sellers', sellerController.create);
router.get('/sellers', sellerController.list);

router.delete('/sales/:id', saleController.delete);
router.patch('/sales/:id', saleController.alter);
router.get('/sales', saleController.list);

module.exports = router;