import axios from 'axios';

const BASE_URL = 'https://apis.data.go.kr/1160100/service/GetSecuritiesProductInfoService/getETFSecuritiesProductInfo';

/**
 * Fetch ETF data for a specific date.
 * Public Data Portal requires 'serviceKey' and 'basDt'.
 * If a date is a holiday, no data is returned. We might need to retry with previous date.
 * But here we just fetch what is requested.
 */
export async function fetchEtfData(serviceKey, date, pageNo = 1, numOfRows = 1000) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                serviceKey: decodeURIComponent(serviceKey), // serviceKey is often already encoded
                numOfRows,
                pageNo,
                resultType: 'json',
                basDt: date.replace(/-/g, '') // YYYYMMDD format
            }
        });

        const items = response.data?.response?.body?.items?.item;

        if (!items) {
            console.warn(`No data for date: ${date}`);
            return [];
        }

        // If items is not array (single item), wrap it
        return Array.isArray(items) ? items : [items];

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}

/**
 * Helper to fetch all pages for a date (if > 1000 items, unlikely for ETF but safe to assume)
 * Currently ETF list is around 800-900, so 1000 limit is fine.
 */
export async function fetchAllEtfDataForDate(serviceKey, date) {
    // Handling decoding/encoding of serviceKey is tricky. 
    // Usually the user provides a "Decoding" key which we send as is, or "Encoding" key which we don't encode again.
    // Axios params encodes values. If key is already encoded, we might need to be careful.
    // Let's assume user provides Decoding key (Raw).

    return fetchEtfData(serviceKey, date);
}
