import { LRUCache } from 'lru-cache';
import yahooApi from './fetch.js'; // ใช้ import แทน require

// 1. ตั้งค่าแคช
const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 10  // 10 นาที
});

// 2. ดึงจากแคชหรือ API
export default async function getStockData(symbol, range = '1d', interval = '2m') {
  const key = `${symbol}-${range}-${interval}`;

  if (cache.has(key)) {
    console.log(`✅ [แคช] ${key}`);
    return cache.get(key);
  }

  console.log(`🌐 [API] ดึงใหม่: ${key}`);
  const data = await yahooApi(symbol, range);

  const slimData = {
    symbol,
    shortName: data.chart.result[0].meta.shortName,
    range: data.chart.result[0].meta.range,
    dataGranularity: data.chart.result[0].meta.dataGranularity,
    timestamp: data.chart.result[0].timestamp,
    close: data.chart.result[0].indicators.quote[0].close,
    closePrice: data.chart.result[0].indicators.quote[0].close[data.chart.result[0].indicators.quote[0].close.length - 1],
    
  };

  cache.set(key, slimData);
  return slimData;
}
