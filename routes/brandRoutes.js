import express from "express"
import { body } from "express-validator";
import  {runValidation} from "../middleware/validator.js"
import { brandController } from "../controllers/brandController.js"
const router =  express.Router()

router.get("/", brandController.get);
router.get("/:id", brandController.getOne);
router.post("/",body('name').notEmpty().withMessage("Ism talab qilinadi."),runValidation, brandController.post);
router.put("/:id",body('name').notEmpty().withMessage("Ism talab qilinadi."),runValidation, brandController.put);
router.delete("/:id", brandController.deleteOne);

export default router;

