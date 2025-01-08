import express from "express";
import {
  getallproduct,
  getfeateuredproduct,
  deleteproduct,
  createproduct,
  getrecommendedproduct,
  getproductbycategorym,
  togglefeaturedproduct,
} from "../controllers/productcontroller.js";
import { protectedroute, adminroute } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", protectedroute, adminroute, getallproduct);
router.get("/feateured", getfeateuredproduct);
router.get("/recommended", getrecommendedproduct);
router.get("/category/:category", getproductbycategory);
router.post("/", protectedroute, adminroute, createproduct);
router.put("/:id", protectedroute, adminroute, togglefeaturedproduct);
router.delete("/:id", protectedroute, adminroute, deleteproduct);

export default router;
