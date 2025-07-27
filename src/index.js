import express from 'express'
    import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
    import { Chart } from 'chart.js'
    import annotationPlugin from 'chartjs-plugin-annotation'
    import datalabels from 'chartjs-plugin-datalabels'

    // 🔥 สมัคร plugin
    Chart.register(annotationPlugin, datalabels)

    const app = express()
    const port = process.env.PORT || 3000

    // 🎨 ตั้งค่ากระดาษวาด
    const width = 800
    const height = 400
    const chartCanvas = new ChartJSNodeCanvas({
      width,
      height,
      chartCallback: (ChartJS) => ChartJS.register(annotationPlugin, datalabels)
      })
const title = {
  display: true,
  text: 'nvda',
  font: { size: 20, weight: 'bold' }
}
const target = {
  type: "line",
  scaleID: "x",             // 🟢 แกน x = เส้นแนวตั้ง
  value: "November",        // 🟢 ค่าใน labels
  borderColor: "red",
  borderWidth: 2,
  borderCapStyle: 'butt',   // 🛡️ ป้องกัน error
  label: {
    display: true,
    content: "Target",
    position: "end",
    backgroundColor: "rgba(255,99,132,0.7)",
    color: "white"
  }
};
const watermark = {
  type: 'box',
  drawTime: 'afterDatasetsDraw', // ✅ มาที่นี่!
  xScaleID: 'x',
  yScaleID: 'y',
  xMin: 0,
  xMax: 1,
  yMin: 0,
  yMax: 1,
  backgroundColor: 'transparent',
  borderWidth: 0,
  label: {
    display: true,
    color: 'rgba(208, 208, 208, 0.2)',
    content: 'PORTSNAP',
    font: {
      size: (ctx) => ctx.chart.chartArea.height / 1.5
    },
    position: 'center'
  }
};
    // 📊 config กราฟ
const chartConfig = {
  type: 'line',
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
          const value = context.dataset.data[context.dataIndex];
          return value?.label;
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
    responsive: false,
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
      datalabels: {
        font: { family: 'sans-serif', size: 14, weight: 'bold' }
      },
      annotation: {
        annotations: {
        //  target,
       //   watermark
        }
      }
    }
  }
}

app.get('/chart', async (req, res) => {
  try {
    const imageBuffer = await chartCanvas.renderToBuffer(chartConfig)
    res.set('Content-Type', 'image/png')
    res.send(imageBuffer)
  } catch (err) {
    console.error('🛑 Chart Error:', err)
    res.status(500).send(`Failed to generate chart\n${err.message}`)
  }
})

    // 🚀 Start server
    app.listen(port, () => {
      console.log(`🎯 Chart API ready at http://localhost:${port}/chart`)
    })