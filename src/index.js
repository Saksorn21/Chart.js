import express from "express"
import generateChart from './chart/generate.js'
import configChart from './chart/config.js'
const app = express()
  const port = process.env.PORT || 3000
//ใน Express route ของคุณ:
app.get("/chart/:symbol/:range-:interval.png", async (req, res) => {
  try {
    const { symbol, range, interval } = req.params
    const config = await configChart(symbol, range, interval)
    const imageBuffer = await generateChart(config);
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
app.get("/test:range", async (req, res) => {
  try {
    const { range } = req.params
    const config = await configChart('NVDA', range, '2m')
    const imageBuffer = await generateChart(config);
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