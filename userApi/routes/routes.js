var express = require("express")
var app = express();
var router = express.Router();
var HomeController = require("../controllers/HomeController");
var UserController = require("../controllers/UserController");
const auth = require('../middleware/AdminAuth')

router.get('/', HomeController.index);
router.post('/user', UserController.create);
router.get('/user',auth, UserController.index);
router.get('/user/:id',auth, UserController.findUser);
router.put('/user',auth, UserController.edit);
router.delete('/user/:id',auth, UserController.remove);
router.post('/recoverpassword', UserController.recoverPassword);
router.post('/changepassword', UserController.changePassword);
router.post('/login', UserController.login);
router.post("/validate",auth, HomeController.validateToken);

module.exports = router;