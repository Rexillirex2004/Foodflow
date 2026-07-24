import { app } from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`FoodFlow API escuchando en http://localhost:${env.PORT}`);
});
