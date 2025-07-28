import express from "express"
import generateChart from './chart/generate.js'
import configChart from './chart/config.js'
const app = express()
  const port = process.env.PORT || 3000
//ใน Express route ของคุณ:
app.get("/test/chart", async (req, res) => {
  try {
    const imageBuffer = await generateChart(await configChart());
    res.set("Content-Type", "image/png");
    res.send(imageBuffer);
  } catch (err) {
    console.error("🛑 Chart Error:", err);
    res
      .status(500)
      .send(
        `Failed to generate chart\nError details: ${err.message}\nStack: ${err.stack}`,
      );
  }
});
// 🚀 Start server
app.listen(port, () => {
  console.log(`🎯 Chart API ready at http://localhost:${port}/chart`)
})