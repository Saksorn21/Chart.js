import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'
import Chart from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation'
import datalabels from 'chartjs-plugin-datalabels'

// ✨ ลงทะเบียน plugin
Chart.register(annotationPlugin, datalabels)

// 🎨 สร้าง canvas renderer
const width = 800
const height = 400
const chartCanvas = new ChartJSNodeCanvas({ width, height, chartCallback: (ChartJS) => {
  ChartJS.register(annotationPlugin, datalabels)
}})

// 🏗️ Chart config ตัวอย่าง
const config = {
  type: 'line',
  data: {
    labels: ['June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
      label: 'buy',
      data: [
        { x: 'June', y: null },
        { x: 'July', y: null },
        { x: 'August', y: null },
        { x: 'September', y: 50 },
        { x: 'October', y: null, label: '0' },
        { x: 'November', y: null },
        { x: 'December', y: 70, label: 'Hold: 70' }
      ],
      borderWidth: 3,
      pointRadius: 2,
      fill: false,
      borderColor: 'green',
      spanGaps: true,
      datalabels: {
        display: (ctx) => ctx.raw?.label != null,
        formatter: (value) => value.label ?? '',
        align: 'top',
        backgroundColor: 'black',
        borderRadius: 4,
        color: 'white',
        font: {
          weight: 'bold',
          size: 14
        }
      }
    }]
  },
  options: {
    responsive: false,
    plugins: {
      datalabels: {} // 🧠 ต้องมีตรงนี้ให้มัน apply
    }
  }
}

// 🚀 Elysia server
const app = new Elysia({ adapter: node() })
  .get('/chart', async () => {
    const image = await chartCanvas.renderToBuffer(config)
    return new Response(image, {
      headers: {
        'Content-Type': 'image/png'
      }
    })
  })
  .listen(3000)

console.log(`🔥 Chart API พร้อมใช้งาน: http://localhost:3000/chart`)