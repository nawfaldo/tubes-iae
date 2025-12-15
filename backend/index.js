import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";

import "./db.js";

import { authRouter } from "./routes/authRoutes.js";
import { restaurantRouter } from "./routes/restaurantRoutes.js";
import { cartRouter } from "./routes/cartRoutes.js";
import { invoiceRoutes } from "./routes/invoiceRoutes.js";
import { schema, rootResolvers } from "./graphql/schema.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));

app.use(express.json());

app.use("/auth", authRouter);
app.use("/restaurants", restaurantRouter);
app.use("/cart", cartRouter)
app.use("/invoice", invoiceRoutes);
app.use(
  "/graphql",
  graphqlHTTP((req, res) => ({
    schema,
    rootValue: rootResolvers,
    context: { req, res },
    graphiql: true,
  }))
);

app.listen(3000, () => console.log("running http://localhost:3000"));