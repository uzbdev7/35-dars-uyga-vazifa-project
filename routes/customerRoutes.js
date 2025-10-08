import express from "express"
import { body } from "express-validator";
import  {runValidation} from "../middleware/validator.js"
import { customerController } from "../controllers/customerController.js"
const router =  express.Router()

router.get("/", customerController.get);
router.get("/:id", customerController.getOne);
router.post("/",body('name').notEmpty().withMessage("Ism talab qilinadi."),body('phone_number').notEmpty().withMessage("Raqam talab qilinadi."),runValidation, customerController.post);
router.put("/:id",body('name').notEmpty().withMessage("Ism talab qilinadi."), body('phone_number').notEmpty().withMessage("Raqam talab qilinadi."),runValidation, customerController.put);
router.delete("/:id", customerController.deleteOne);

export default router