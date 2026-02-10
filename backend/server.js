import app from "./src/app.js";
import connectDB from "./src/config/db.js";


const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Local server running on http://localhost:${PORT}`);
  });
}

start();
