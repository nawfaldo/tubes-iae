import express from "express";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";

console.log("🚀 Starting backend server...\n");

// Initialize database (will log its own status)
import "./db.js";

// Load routes
console.log("📁 Loading routes...");
import { authRouter } from "./routes/authRoutes.js";
import { restaurantRouter } from "./routes/restaurantRoutes.js";
import { cartRouter } from "./routes/cartRoutes.js";
import { invoiceRoutes } from "./routes/invoiceRoutes.js";
console.log("✅ Routes loaded");

// Load GraphQL schema and resolvers (will log their own status)
import { schema, rootResolvers } from "./graphql/schema.js";

const app = express();

// Setup CORS
console.log("🌐 Configuring CORS...");
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
console.log("✅ CORS configured (origin: http://localhost:5173)");

// Setup JSON parser
app.use(express.json());
console.log("✅ JSON parser enabled");

// Setup REST API routes
console.log("🔗 Setting up REST API routes...");
app.use("/auth", authRouter);
console.log("  ✅ /auth route registered");
app.use("/restaurants", restaurantRouter);
console.log("  ✅ /restaurants route registered");
app.use("/cart", cartRouter);
console.log("  ✅ /cart route registered");
app.use("/invoice", invoiceRoutes);
console.log("  ✅ /invoice route registered");

// Setup GraphQL endpoint
console.log("🔗 Setting up GraphQL endpoint...");
app.use(
  "/graphql",
  graphqlHTTP((req, res) => ({
    schema,
    rootValue: rootResolvers,
    context: { req, res },
    graphiql: true,
  }))
);
console.log("  ✅ /graphql route registered (GraphiQL enabled)");

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log("\n" + "=".repeat(50));
  console.log("✅ Backend server is running!");
  console.log(`🌐 Server URL: http://localhost:${PORT}`);
  console.log(`📊 GraphQL Playground: http://localhost:${PORT}/graphql`);
  console.log("=".repeat(50) + "\n");
});