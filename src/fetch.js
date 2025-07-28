const url = 'https://yahoo-finance-real-time1.p.rapidapi.com/stock/get-chart?symbol=GOOG&region=US&lang=en-US&useYfid=true&includeAdjustedClose=true&events=div%2Csplit%2Cearn&range=1d&interval=1m&includePrePost=false';
const defaultOptions = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': 'fc2463122fmsh421b4d662ac4d16p12bad6jsn6be908fe4c05',
    'x-rapidapi-host': 'yahoo-finance-real-time1.p.rapidapi.com'
  }
}


export default async function yahooApi(symbol = "NVDA", range = "1d", interval = "5m") {
  const url = `https://yahoo-finance-real-time1.p.rapidapi.com/stock/get-chart?symbol=${symbol}&region=US&lang=en-US&useYfid=false&includeAdjustedClose=truel&range=${range}&interval=${interval}&includePrePost=false`
   try {
     const res = await fetch(url, defaultOptions);
     if (!res.ok) {
       throw new Error(`API error: ${res.status} ${res.statusText}`);
     }
     return await res.json();
   } catch (error) {
     console.error(error);
     return error
   }
}