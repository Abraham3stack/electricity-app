import "dotenv/config";
import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = process.env.PORT || 5001;

async function testDB() {
  const users = await prisma.user.findMany();
  // console.log(users);
}
if (process.env.NODE_ENV !== "production") {
  testDB();
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
});