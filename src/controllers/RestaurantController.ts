import { Request, Response } from "express";
import Restaurant from "../models/restaurant";


const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restauntId = req.params.restaurantId;    
    const restaurant = await Restaurant.findById(restauntId);
    if(!restaurant) {
      return res.status(404).json({message: "Restaurant doesn't exist"})
    }
    res.json(restaurant)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

const searchRestaurants = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.params.searchTerm;
    const searchQuery = req.query.searchQuery as string || "";
    const selectedCuisines = req.query.selectedCuisines as string || "";
    const sortOption = req.query.sortOption as string || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {
      $or: [
        { city: new RegExp(searchTerm, "i") },
        { country: new RegExp(searchTerm, "i") }
      ]
    };
    const cityCheck = await Restaurant.countDocuments(query)
    if (cityCheck === 0) {
      return res.status(404).json({
        data: [],
        pagination: {
          total: 0,
          page: 1,
          pages: 1
        }
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines.split(',').map((cuisine) => new RegExp(cuisine, "i"));
      query['cuisines'] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query['$or'] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } }
      ]
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize

    const restaurants = await Restaurant.find(query).sort({ [sortOption]: -1 }).skip(skip).limit(pageSize).lean();
    const total = await Restaurant.countDocuments(query)
    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize), //50 results, pageSize = 10 > pages = 5
      }
    }

    res.json(response)
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Something went wrong' })
  }
}

export default {
  getRestaurant,
  searchRestaurants
}