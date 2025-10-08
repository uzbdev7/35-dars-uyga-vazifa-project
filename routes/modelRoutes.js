import { Router } from "express";
import { body } from "express-validator";
import  {runValidation} from "../middleware/validator.js"
import { modelController } from "../controllers/modelController.js";
const router = Router()

router.get("/", modelController.get);
router.get("/:id", modelController.getOne);
router.get("/brand/:brand_id", modelController.getModelById)
router.post("/",body('name').notEmpty().withMessage("Ism talab qilinadi."), body('brand_id').isInt().withMessage("Raqam talab qilinadi."),runValidation, modelController.post)
router.put("/:id",body('name').notEmpty().withMessage("Ism talab qilinadi."),body('brand_id').isInt().withMessage("Raqam talab qilinadi."),runValidation, modelController.put)
router.delete("/:id", modelController.deleteOne)

export default router