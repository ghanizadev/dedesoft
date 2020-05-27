const router = require("express").Router();
const saleController = require("../controllers/salesController");
const sellerController = require("../controllers/sellersController");
const authController = require("../controllers/authController");
const authHandler = require("../middlewares/authHandler");

router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);
router.post('/reset-code', authHandler(['admin']), authController.makeCode);

router.post('/sellers/:seller_id/add', authHandler(['seller', 'admin']), saleController.create);
router.delete('/sellers/:seller_id', authHandler(['admin']), sellerController.delete);
router.get('/sellers/:seller_id/list', authHandler(['seller', 'admin']), saleController.listId);
router.post('/sellers', sellerController.create);
router.get('/sellers', authHandler(['admin']), sellerController.list);

router.delete('/sales/:id', authHandler(['admin', 'cashier', 'seller']), saleController.delete);
router.patch('/sales/:id', authHandler(['cashier', 'admin', 'seller']), saleController.alter);
router.get('/sales/:id', authHandler(['cashier', 'admin']), saleController.listSingle);
router.get('/sales', authHandler(['cashier', 'admin']), saleController.listAll);

module.exports = router;