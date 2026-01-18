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
            // Production: Use CORS Proxy
            const targetUrl = new URL(`https://apis.data.go.kr${API_PATH}`);
            Object.keys(params).forEach(key => targetUrl.searchParams.append(key, params[key]));
            const targetUrlStr = targetUrl.toString();

            try {
                // Primary Proxy: corsproxy.io (Transparent)
                const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrlStr)}`;
                const response = await axios.get(proxyUrl);
                responseData = response.data;
            } catch (err) {
                console.warn("Primary proxy failed, trying fallback...", err);
                // Fallback Proxy: allorigins.win
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrlStr)}`;
                const response = await axios.get(proxyUrl);
                if (response.data && response.data.contents) {
                    try {
                        responseData = JSON.parse(response.data.contents);
                    } catch (e) {
                        responseData = response.data.contents;
                    }
                } else {
                    throw new Error("Fallback proxy response was empty");
                }
            }
        }

        // Check for API-specific error codes
        if (typeof responseData === 'string' && responseData.trim().startsWith('<')) {
            // XML parsing attempt for error extraction could go here, 
            // but usually 'resultCode' check below covers JSON responses.
            // If it's XML, it means the API didn't return JSON as requested (Auth error mostly).
            // We'll let the catch block handle the XML Error throwing.
        }

        const header = responseData?.response?.header;
        if (header && header.resultCode !== '00') {
            throw new Error(`API Error [${header.resultCode}]: ${header.resultMsg}`);
        }

        const items = responseData?.response?.body?.items?.item;

        if (!items) {
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
