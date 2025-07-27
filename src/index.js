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
      chartCallback: (ChartJS) => {
        ChartJS.register(annotationPlugin, datalabels)
      }
    })
const title = {
  display: true,
  text: 'nvda',
  font: { size: 20, weight: 'bold' }
}
const target =  {
    type: "line",
    yMin: 180,
    yMax: 180,
    borderColor: "red",
    borderWidth: 2,
    label: {
      display: true,
      content: "Target",
      position: "end",
      backgroundColor: "rgba(255,99,132,0.7)",
      color: "white"
        }
      }
const annotation = {
  type: 'box',
  backgroundColor: 'transparent',
  borderWidth: 0,
  label: {
    drawTime: 'afterDatasetsDraw',
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
            { x: 'October', y: null, },
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
            formatter: value => value.label  || '',
            align: 'top',
            backgroundColor: 'back',
            borderRadius: 4,
            color: 'white',
            font: {
              weight: 'bold',
              size: 12
            }
          }
        }]
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false
                }
              }
            },
        responsive: false,
        plugins: {
          title,
          legend: { display: false},
          datalabels: {
            font: {
              family: 'sans-serif',
              size: 14,
              weight: 'bold'
            }
          },
          annotation: {
            annotations:{
              box1: {
                type: 'box',
                xMin: 1,
                xMax: 2,
                backgroundColor: "red"
              }
            }   
          }
        } 
      }
    }
    app.get('/', (req, res) => {
      res.send('hello‘ Portsnap')
    })
    // 🛠️ สร้าง API Endpoint
    app.get('/chart', async (req, res) => {
      try {
        const imageBuffer = await chartCanvas.renderToBuffer(chartConfig)
        res.set('Content-Type', 'image/png')
        res.send(imageBuffer)
      } catch (err) {
        console.error('🛑 Chart Error:', err)
        res.status(500).send('Failed to generate chart')
      }
    })
console.log(chartConfig)
    // 🚀 Start server
    app.listen(port, () => {
      console.log(`🎯 Chart API ready at http://localhost:${port}/chart`)
    })