import express, { Request, Response } from 'express'
import { param } from 'express-validator';
import RestaurantController from '../controllers/RestaurantController';

const router = express.Router();

router.get('/:restaurantId',
    param('restaurantId')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('RestaurantId paramenter must be a valid string'),
    RestaurantController.getRestaurant
)

router.get('/search/:searchTerm',
    param('searchTerm')
        .isString()
        .trim()
        .notEmpty()
        .withMessage('Search term must be a valid string'),
    RestaurantController.searchRestaurants
);


export default router