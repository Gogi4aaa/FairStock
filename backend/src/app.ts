import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/", userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
