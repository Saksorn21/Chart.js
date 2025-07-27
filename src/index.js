import express from "express"
import generateChart from './chart/generateChart.js'
const app = express()
const port = process.env.PORT || 3000
// Register all necessary components

const title = {
  display: true,
  text: 'nvda',
  font: { size: 20, weight: 'bold' }
}
const target =  {
  type: "line",
  scaleID: "y",   // 🟢 ต้องใส่แกน y
  value: 1,     // 🟢 เปลี่ยนจาก yMin/yMax → value (เพราะเส้นเดียวแนวนอน)
  borderColor: "red",
  borderWidth: 2,
  borderCapStyle: 'butt', // 🟢 ป้องกัน undefined
  label: {
    display: true,
    content: "Target",
    position: "end",
    backgroundColor: "rgba(255,99,132,0.7)",
    color: "white"
  }
}
const name = {
  type: 'box',
  backgroundColor: 'transparent',
  borderWidth: 0,
  label: {
    drawTime: 'afterDatasetsDraw',
    display: true,
    color: 'rgba(208, 208, 208, 0.2)',
    content: 'PORTSNAP',
    font: {
      size: (ctx) => ctx.chart.chartArea.height / 3
    },
    position: 'center'
  }
};
const chartConfig = {
  type: "line",
  data: {
    labels: ['June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
      label: 'Buy Signal',
      data: [
        { x: 'June', y: null },
        { x: 'July', y: null },
        { x: 'August', y: null },
        { x: 'September', y: 50 },
        { x: 'October', y: null },
        { x: 'November', y: null },
        { x: 'December', y: 70, label: 'Hold: 70' }
      ],
      borderColor: 'green',
      borderWidth: 3,
      spanGaps: true,
      pointRadius: 0,
      fill: false,
      datalabels: {
        display: (context) => {
          const index = context.dataIndex;
          const value = context.dataset.data[index];
          const min = Math.min.apply(null, context.dataset.data);
          const max = Math.max.apply(null, context.dataset.data);
          return (
            index == 0 ||
            index == context.dataset.data.length - 1 ||
            value == min ||
            value == max
          );
        },
        formatter: value => value.label || '',
        align: 'top',
        backgroundColor: 'black',
        borderRadius: 4,
        color: 'white',
        font: { weight: 'bold', size: 12 }
      }
    }]
  },
  options: {
    // ... your options, including plugins.annotation and datalabels
      scales: {
        x: {
          type: 'category',  // 🟢 ต้องใส่ type ด้วย
          grid: { display: false }
        },
        y: {
          type: 'linear',  // 🟢 ต้องมีชัดเจน
          grid: { display: true }
        }
      },
      plugins: {
        title,
        legend: { display: false },
      annotation: {
        annotations: {
          targetLine: {
            type: "line",
            scaleID: "x",
            value: "November",
            borderColor: "red",
            borderWidth: 2,
            borderCapStyle: "butt",
            label: {
              display: true,
              content: "Target",
              position: "end",
              backgroundColor: "rgba(255,99,132,0.7)",
              color: "white",
            },
          },
          name
        },
      },
      datalabels: {
        /* ... */
      },
    },
  },
};


//ใน Express route ของคุณ:
app.get("/test/chart", async (req, res) => {
  try {
    const imageBuffer = await generateChart(chartConfig);
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