import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.js";

import { phoneRouter, brandRouter, modelRouter, customerRouter, orderRouter } from "./routes/index.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(errorHandler);


app.use("/phones", phoneRouter);
app.use("/brands", brandRouter);
app.use("/models", modelRouter);
app.use("/customers", customerRouter);
app.use("/orders", orderRouter);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server ${PORT} portda ishlayapti`);
});
