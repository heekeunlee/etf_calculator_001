import axios from 'axios';

const BASE_URL = 'https://apis.data.go.kr/1160100/service/GetSecuritiesProductInfoService/getETFSecuritiesProductInfo';

export async function fetchEtfData(serviceKey, date, pageNo = 1, numOfRows = 1000) {
    try {
        // NOTE: The serviceKey should be properly encoded.
        // If users provide the 'Decoding' key, we must ensure it is used correctly.
        // Axios encodes params.

        const response = await axios.get(BASE_URL, {
            params: {
                serviceKey: decodeURIComponent(serviceKey),
                numOfRows,
                pageNo,
                resultType: 'json',
                basDt: date.replace(/-/g, '')
            }
        });

        // Check for API-specific error codes in JSON body (common in Korean Gov APIs)
        // e.g. { response: { header: { resultCode: '99', resultMsg: '...' } } }
        const header = response.data?.response?.header;
        if (header && header.resultCode !== '00') {
            throw new Error(`API Error [${header.resultCode}]: ${header.resultMsg}`);
        }

        const items = response.data?.response?.body?.items?.item;

        if (!items) {
            // It might be empty result, which is fine, but check header again
            return [];
        }

        return Array.isArray(items) ? items : [items];

    } catch (error) {
        // Try to read XML error if possible (Response might be XML despite requesting JSON if error occurs)
        // Check if error.response.data is string starting with <
        if (error.response && typeof error.response.data === 'string' && error.response.data.trim().startsWith('<')) {
            throw new Error("API returned XML Error (Auth failed or Service error). Check your Service Key.");
        }

        throw error;
    }
}

export async function fetchAllEtfDataForDate(serviceKey, date) {
    return fetchEtfData(serviceKey, date);
}
