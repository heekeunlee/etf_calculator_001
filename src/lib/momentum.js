import { subWeeks, subMonths, format, subDays } from 'date-fns';
import { fetchAllEtfDataForDate } from '../services/api';

/**
 * Calculate momentum scores given parameters.
 */
export async function calculateMomentum(apiKey, refDateStr, weights, filters, onProgress) {
    const refDate = new Date(refDateStr);

    // 1. Define target dates
    const targets = [
        { key: 't', date: refDate, weight: 0 },
        { key: 'w1', date: subWeeks(refDate, 1), weight: weights.w1w },
        { key: 'w2', date: subWeeks(refDate, 2), weight: weights.w2w },
        { key: 'm1', date: subMonths(refDate, 1), weight: weights.w1m },
        { key: 'm3', date: subMonths(refDate, 3), weight: weights.w3m },
        { key: 'm6', date: subMonths(refDate, 6), weight: weights.w6m },
    ];

    const dataMap = {};

    // 2. Fetch data for each date (handling holidays)
    // We do this sequentially or parallel? Parallel is faster.
    // However, if we hit rate limits, sequential might be safer.
    // Public Data Portal usually has high allowances. Parallel for now.

    // Helper to fetch valid data for a date or prior working days
    const fetchValidData = async (targetDate) => {
        let currentAttempts = 0;
        let d = targetDate;

        while (currentAttempts < 7) { // Try up to 7 days back
            const dateStr = format(d, 'yyyyMMdd');
            try {
                if (onProgress) onProgress(`Fetching data for ${dateStr}...`);
                const data = await fetchAllEtfDataForDate(apiKey, dateStr);
                if (data && data.length > 0) {
                    return { date: dateStr, items: data };
                }
            } catch (e) {
                if (onProgress) onProgress(`⚠️ Failed to fetch for ${dateStr}: ${e.message}`);
                console.warn(`Failed to fetch for ${dateStr}`, e);
            }
            // Go back 1 day
            d = subDays(d, 1);
            currentAttempts++;
        }
        return { date: null, items: [] };
    };

    const results = await Promise.all(targets.map(t => fetchValidData(t.date)));

    // Store results in map
    targets.forEach((t, index) => {
        dataMap[t.key] = results[index];
    });

    if (!dataMap.t.date) {
        throw new Error("기준일에 대한 데이터를 찾을 수 없습니다. 휴장일이거나 서비스 키를 확인해주세요.");
    }

    // 3. Process Data
    // We base everything on 't' (Reference Date) items
    const baseItems = dataMap.t.items;
    const finalResults = [];

    const getPrice = (periodKey, isin) => {
        const items = dataMap[periodKey].items;
        if (!items) return null;
        const item = items.find(i => i.isin === isin);
        return item ? Number(item.clpr) : null; // clpr: Closing Price
    };

    for (const item of baseItems) {
        // Filter out if needed (e.g. by market type if API returns others, usually ETF API only returns ETFs but check 'itmTpCd' if available?)
        // The API is getETFSecuritiesProductInfo, so it should be all ETFs.

        // Basic info
        const isin = item.isin;
        const priceT = Number(item.clpr);
        const marketCap = Number(item.mrktTotAmt); // String to Number
        const volume = Number(item.trqu);
        const amount = Number(item.trPrc);

        // Apply Filters (Volume, Amount)
        // filters.minVolume is in "man-ju" (10,000 shares)
        // filters.minAmount is in "eok-won" (100,000,000 KRW)

        if (volume < filters.minVolume * 10000) continue;
        if (amount < filters.minAmount * 100000000) continue;

        const entry = {
            ...item,
            returns: {},
            momentumScore: 0
        };

        // Calculate Returns
        let totalScore = 0;
        let totalWeight = 0;

        for (const t of targets) {
            if (t.key === 't') continue;

            const pricePrev = getPrice(t.key, isin);
            if (pricePrev) {
                const ret = (priceT - pricePrev) / pricePrev * 100;
                entry.returns[t.key] = ret;

                // Add to score
                totalScore += ret * t.weight;
                totalWeight += t.weight; // Currently purely additive based on user formula assumption
            } else {
                // If previous price missing (new listing?), punish or ignore?
                // Usually treat as 0 return or skip?
                // For momentum, maybe 0.
                entry.returns[t.key] = 0;
            }
        }

        // User image shows simply weights. 
        // We will sum them up. 
        entry.momentumScore = totalScore;

        finalResults.push(entry);
    }

    // 4. Sort by Momentum Score
    finalResults.sort((a, b) => b.momentumScore - a.momentumScore);

    return finalResults;
}
