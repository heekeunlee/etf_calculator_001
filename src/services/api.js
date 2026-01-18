import axios from 'axios';

// Use proxy in development to bypass CORS
const API_PATH = '/1160100/service/GetSecuritiesProductInfoService/getETFSecuritiesProductInfo';

export async function fetchEtfData(serviceKey, date, pageNo = 1, numOfRows = 1000) {
    try {
        const params = {
            serviceKey: decodeURIComponent(serviceKey),
            numOfRows,
            pageNo,
            resultType: 'json',
            basDt: date.replace(/-/g, '')
        };

        let responseData;

        if (import.meta.env.DEV) {
            // Development: Use Vite Local Proxy
            const response = await axios.get(`/api${API_PATH}`, { params });
            responseData = response.data;
        } else {
            // Production: Use allorigins.win Public Proxy to bypass CORS
            // 1. Construct the target URL with query parameters
            const targetUrl = new URL(`https://apis.data.go.kr${API_PATH}`);
            Object.keys(params).forEach(key => targetUrl.searchParams.append(key, params[key]));

            // 2. Wrap via allorigins
            const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl.toString())}`;
            const response = await axios.get(proxyUrl);

            // 3. Parse contents (allorigins returns JSON with 'contents' string)
            if (response.data && response.data.contents) {
                try {
                    responseData = JSON.parse(response.data.contents);
                } catch (e) {
                    // Fallback if content is XML string or other
                    responseData = response.data.contents;
                }
            } else {
                throw new Error("Proxy response was empty");
            }
        }

        // Check for API-specific error codes in JSON body (common in Korean Gov APIs)
        // e.g. { response: { header: { resultCode: '99', resultMsg: '...' } } }
        const header = responseData?.response?.header;
        if (header && header.resultCode !== '00') {
            throw new Error(`API Error [${header.resultCode}]: ${header.resultMsg}`);
        }

        const items = responseData?.response?.body?.items?.item;

        if (!items) {
            // It might be empty result, which is fine, but check header again
            return [];
        }

        return Array.isArray(items) ? items : [items];

    } catch (error) {
        // Try to read XML error if possible (Response might be XML despite requesting JSON if error occurs)
        // Check if error response data or payload is string starting with <
        // In the new logic, responseData might be the string.

        // Helper to check if a value is an XML error string
        const isXmlError = (val) => typeof val === 'string' && val.trim().startsWith('<');

        const dataToCheck = error.response?.data || (typeof error === 'string' ? error : null);

        // We might have caught an error where responseData is defined but logic threw
        // We don't have easy access to responseData in catch block if it wasn't passed, 
        // but broadly we assume if it failed above it's likely network or parsing.

        if (error.response && isXmlError(error.response.data)) {
            throw new Error("API returned XML Error (Auth failed or Service error). Check your Service Key.");
        }

        if (isXmlError(dataToCheck)) {
            throw new Error("API returned XML Error (Auth failed or Service error). Check your Service Key.");
        }

        throw error;
    }
}

export async function fetchAllEtfDataForDate(serviceKey, date) {
    return fetchEtfData(serviceKey, date);
}
