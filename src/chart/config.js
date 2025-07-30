import getStockData from '../cache.js'
export default async function configChart(symbol, ranges, interval) {

  const data = await getStockData(symbol, ranges, interval)

  const shortName = data.shortName ?? "N/A";
  const timestamps = data.timestamp ?? [];
  const closes = data.close ?? []
  const closePrice = data.closePrice
  const range = data.range ?? '1d'
  const volume = data.volume ?? []
  const dataGranularity = data.dataGranularity ?? '5m'
  const xMin = data.marketStartTime ; // ms
  const xMax = data.marketCloseTime; // ms เวลาปิดตลาด
  // แปลง timestamp เป็นวันที่แบบไทย
  const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
                      "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

  let prevDay = "";
  const labels = timestamps.map(ts => {
    const d = new Date(ts * 1000);
    const day = d.getDate();
    const month = d.getMonth()
    const current = `${day} ${month}`;

    if (current !== prevDay) {
      prevDay = current;
      return current;
    } else {
      return "";
    }
  });
function formatTime(time) {
  if (time === undefined) return null
  if (Array.isArray(time)) {
    return time.map(ts => {
      const date = new Date(ts * 1000);
      return date.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Bangkok'
      });
    }) 
  }
   const date = new Date(time * 1000).toLocaleTimeString('th-TH', {
       hour: '2-digit',
       minute: '2-digit',
       hour12: false,
       timeZone: 'Asia/Bangkok'
     })
  return date
  
}

  // แปลง timestamp เป็นเวลาแบบไทย
  const labelsTime = timestamps.map(ts => {
    const d = new Date(ts * 1000);
    return d.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Bangkok'
    });
  });

  const timeCheck = range === "1d" ? labelsTime : labels;
  const autoSkip = range === "1d";
  const title = {
      display: true,
      position: "top",
      fontSize: 11,
      fontStyle: "bold",
      fontFamily: "Prompt",
      text: `(${data.symbol}) ${shortName} (${range}/${dataGranularity})`
  }
  const target =  {
    type: "line",
    scaleID: "x",   // 🟢 ต้องใส่แกน y
    value: formatTime(timestamps[timestamps.length -1]) ,     // 🟢 เปลี่ยนจาก yMin/yMax → value (เพราะเส้นเดียวแนวนอน)
    borderColor: "red",
    borderWidth: 2,
    borderCapStyle: 'butt', // 🟢 ป้องกัน undefined
    label: {
      display: true,
      content: "Target",
      position: 'end',
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
        family: 'Prompt',
        weight: 'bold',
        size: (ctx) => ctx.chart.chartArea.height / 3
      },
      position: 'center'
    }
  };
  const dataVolume = {
    type: 'bar',
    data: volume,
    backgroundColor: 'rgba(153, 102, 255, 0.5)',
    yAxisID: 'y1',
      datalabels: {
      display: false},
    borderRadius: 2,
      barThickness: 4,               // ลดอีก
      categoryPercentage: 0.4,       // บีบช่อง
      barPercentage: 0.6 
    }
  const boxData = {
    label: 'Buy Signal',
    data: [
      { x: timeCheck[timeCheck.length -1], y: closePrice },
      { x: 'December', y: 7, label: 'Hold: 70' }
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
    }

  const chartConfig = {
    type: "line",
    data: {
      labels: timeCheck,
      datasets: [
        {
          label: `(${data.symbol}) ${shortName} (${range}/${dataGranularity})`,
          data: closes,
          bg: "red",
          borderColor: '#555879',
          yAxisID: 'y',
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 0,
          fill: false,
          tension: 0.2,
          datalabels: {
            display: false}},
      //  dataVolume
]
    },
    options: {
      // ... your options, including plugins.annotation and datalabels
        scales: {
          x: {
            type: 'category', // category
              min: formatTime(xMin),
              max: formatTime(xMax),
              time: {
                parser: 'HH:mm',
                unit: 'minute',
                displayFormats: {
                  minute: 'HH:mm',
                  hour: 'HH:mm',
                  day: 'MMM dd'
                }
              },
            grid: { display: false },
            ticks: {
              autoSkip: autoSkip,
              fontFamily: "Prompt",
              fontSize: 10,
              fontStyle: "bold"}
          },
          y: {
            type: 'linear',  // 🟢 ต้องมีชัดเจน
            grid: { display: true }
          },          
          y1: {
            type: 'linear',  // 🟢 ต้องมีชัดเจน
            mix: 150,
            ticks: { display: false},
            grid: { display: false, drawOnChartArea: false },
            position: 'right',
              title: { display: false, text: 'Volume' },
            
            beginAtZero: true, // ทำให้ volume เริ่มจาก 0
            suggestedMax: 100
          }
        },
        plugins: {
          title,
          legend: { display: false },
        annotation: {
          annotations: {
           // target,
            name
          },
        },
      },
      layout: {
        padding: {
          bottom: 0
          }
        }
    },
  };

   return chartConfig
}
