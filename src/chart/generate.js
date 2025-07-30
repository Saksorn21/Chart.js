import { createCanvas, registerFont } from "canvas";
import { Chart, registerables } from "chart.js";
import 'chartjs-adapter-date-fns';  
import annotationPlugin from "chartjs-plugin-annotation";
import datalabels from "chartjs-plugin-datalabels";
Chart.register(...registerables, annotationPlugin, datalabels);

registerFont('fonts/Prompt-Regular.ttf', { family: 'Prompt' });

async function generateChart(data, width = 800, height = 400) {

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  new Chart(ctx, data); // สร้าง Chart ลงบน context โดยตรง

  // คืนค่า Buffer ของรูปภาพ
  return canvas.toBuffer("image/png");
}
export default generateChart