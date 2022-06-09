require("dotenv").config({ path: `./config/${process.env.NODE_ENV}.env` });

const express = require("express");
const session = require("express-session"); // rajout

const app = express();

// if(process.env.NODE_ENV=="dev"){ // deja gere en prod.
//   const cors = require("cors");
//   app.use(cors({
//     origin: process.env.ORIGIN,
//     credentials: true
//   }));  
// }

app.use(session({ // rajout
  secret: process.env.SESSION_PASSWORD,
  saveUninitialized: false,
  resave: false,
  cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
}));

app.use(express.json());

const usersRoute = require("./routes/users");
const routeAdmin = require("./routes/admin");
const reunionsRoute = require("./routes/reunions");
const reservationsRoute = require("./routes/reservations");

app // /api/.. sera a rajouter dans la requete en front (base url)
  .use("/reunions", reunionsRoute)
  .use("/reservations", reservationsRoute)
  .use("/admin", routeAdmin)
  .use("/user", usersRoute);


app.get("/api", (_, res) => res.send({ success: "Bienvenue sur l'API M2L" })); 

app.listen(process.env.PORT, () =>
  console.log(`Backend is running on PORT ${process.env.PORT}`)
);

module.exports = app;
