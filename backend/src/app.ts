import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/user.routes.js';
import { protect } from './middleware/auth.middleware.js';
import tokenRoutes from './routes/token.routes.js';
import usageRoutes from './routes/usage.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});

// Protected route
app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "You accessed a protected route",
    user: (req as any).user,
  });
});

// Token Route
app.use("/api/tokens", tokenRoutes);

// Usage Route
app.use("/api/usage", usageRoutes);

// Error handler
app.use(errorHandler);

export default app;