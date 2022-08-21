import express from "express";
import router from "./app/routes/index.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ValidationError } from "express-validation"

dotenv.config();

const app = express();
app.use(cors({ credentials:true, origin:'http://localhost:3000' }));
app.use(cookieParser());
app.use(express.json());
app.use(router);
//JOI validation
app.use(function(err, req, res, next) {

  let response = { msg: err.details.body[0].message, success: 0 }

  if (err instanceof ValidationError) {

    return res.status(err.statusCode).json(response)
    
  }
  
  return res.status(500).json(response)
  
})
// parse requests of content-type - application/x-www-form-urlencoded
//app.use(express.urlencoded({ extended: true }));

// db.sequelize.sync({ force: true }).then(() => {
//     console.log("For development purposes.");
//   });

// set port, listen for requests
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

export const server = app;