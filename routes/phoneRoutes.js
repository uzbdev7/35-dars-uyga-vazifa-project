import express from "express"
import { body } from "express-validator";
import  {runValidation} from "../middleware/validator.js"
import { phoneController } from "../controllers/phoneController.js"
const router =  express.Router()

router.get("/", phoneController.get);
router.get("/:id", phoneController.getOne);
router.get("/model/:model_id", phoneController.getModelById)
router.post("/",body('name').notEmpty().withMessage("Ism talab qilinadi."),runValidation, phoneController.post);
router.put("/:id",body('name').notEmpty().withMessage("Ism talab qilinadi."),runValidation, phoneController.put);
router.delete("/:id", phoneController.deleteOne);

export default router;
