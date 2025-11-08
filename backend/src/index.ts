import dotenv from "dotenv";
import { app } from "./app";
import { createServer } from "http";

dotenv.config();
const port = process.env.PORT;

const server = createServer(app);

server.listen(port, () => {
  console.log(`🚀 App is running on http://localhost:${port}`);
});
