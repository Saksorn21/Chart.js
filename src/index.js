={})    import express from 'express'
    import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
    import Chart from 'chart.js/auto'
    import annotationPlugin from 'chartjs-plugin-annotation'
    import datalabels from 'chartjs-plugin-datalabels'
import { registerFont } from 'canvas'

// โหลดฟอนต์ไทย เช่น NotoSansThai
registerFont('./fonts/Noto-Sans-Thai-Regular.ttf', { family: 'NotoSansThai' })
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
            { x: 'October', y: null, label: '0' },
            { x: 'November', y: null },
            { x: 'December', y: 70, label: 'Hold: 70' }
          ],
          borderColor: 'green',
          borderWidth: 3,
          spanGaps: true,
          fill: false,
          datalabels: {
            display: ctx => ctx.raw && ctx.raw.label != null,
            formatter: value => value.label || '',
            align: 'top',
            backgroundColor: 'black',
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
        responsive: false,
        plugins: {
          datalabels: {
            font: {
              family: 'NotoSansThai',
              size: 14,
              weight: 'bold'
            }
          } // บังคับโหลด
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

    // 🚀 Start server
    app.listen(port, () => {
      console.log(`🎯 Chart API ready at http://localhost:${port}/chart`)
    })