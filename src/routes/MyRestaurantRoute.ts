import express, { Request, Response } from 'express'
import multer from 'multer';
import MyRestaurantController from '../controllers/MyRestaurantController';
import { jwtCheck, jwtParse } from '../middleware/auth';
import { validateMyRestaurantRequest } from '../middleware/validation';

const router = express.Router();

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1025 //5mb
    }
})


router.get('/order', jwtCheck, jwtParse, MyRestaurantController.getMyRestaurantOrders)

router.patch('/order/:orderId/status', jwtCheck, jwtParse, MyRestaurantController.updateOrderStatus)

// /api/my/resturant
router.get('/',MyRestaurantController.getMyRestaurant)

// /api/my/resturant
router.post('/', upload.single('imageFile'), validateMyRestaurantRequest, jwtCheck, jwtParse, MyRestaurantController.createMyRestaurant)

// /api/my/resturant
router.put('/', upload.single('imageFile'), validateMyRestaurantRequest, jwtCheck, jwtParse, MyRestaurantController.updateMyRestaurant)


export default router