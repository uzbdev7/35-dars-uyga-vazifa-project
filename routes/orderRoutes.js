import express from "express"
import { body } from "express-validator";
import  {runValidation} from "../middleware/validator.js"
import { orderController } from "../controllers/orderController.js"
const router =  express.Router()

router.get("/", orderController.get);
router.get("/:id", orderController.getOne);
router.post("/customer/:customer_id", body('customer_id').notEmpty().withMessage("mijoz_id talab qilinadi."),runValidation, orderController.post);
router.put("/:id",body('customer_id').notEmpty().withMessage("mijoz_id talab qilinadi."),runValidation, orderController.put);
router.delete("/:id", orderController.deleteOne);

export default router