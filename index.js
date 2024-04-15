import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./routers/route.js";
import { apiConnected } from "./routers/apiConnect.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());


const port = process.env.PORT;

// //** HTTP GET Request  */
// app.get("/", (req, res) => {
//   res.status(200).json("Welcome to URLSHORTENER Backend API");
// });

//** API routes */

app.use("/api", router);
app.use("/", apiConnected);

// ** start server only when a have vaild connection */
connect()
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected Port http://localhost:${port}`);
      });
    } catch (error) {
      console.log("Can't Connect to the server");
    }
  })
  .catch((error) => {
    console.log("Invalid database connection...!");
  });
