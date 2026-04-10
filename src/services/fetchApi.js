import { Capacitor } from '@capacitor/core';
import { CapacitorHttp } from '@capacitor/core';

/**
 * Map proxy routes to real APIs
 */
const API_MAP = {
    '/api': 'https://api-web.nhle.com',
    '/restApi': 'https://api.nhle.com',
    '/dailyFaceoff': 'https://www.dailyfaceoff.com',
};

const isNative = Capacitor.isNativePlatform();
const isDevWeb = !isNative && import.meta.env.DEV;

function resolveUrl(url) {
    if (!url) return url;
    if (url.startsWith('http')) return url;

    const match = Object.keys(API_MAP).find(prefix =>
        url.startsWith(prefix)
    );

    if (match) {
        const base = API_MAP[match];
        return base + url.replace(match, '');
    }

    return url;
}

/**
 * Unified fetch wrapper (Web + iOS Capacitor)
 */
export async function fetchApi(url, options = {}) {
    const finalUrl = isDevWeb ? url : resolveUrl(url);

    try {
        //NATIVE (iOS / Android)
        if (isNative) {
            const response = await CapacitorHttp.request({
                url: finalUrl,
                method: (options.method || 'GET').toUpperCase(),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    ...(options.headers || {}),
                },
                data: options.body || undefined,
            });

            return {
                json: async () => response.data,
                status: response.status,
                data: response.data,
            };
        }

        //WEB (browser)
        const response = await fetch(finalUrl, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options.headers || {}),
            },
            body: options.body
                ? JSON.stringify(options.body)
                : undefined,
        });

        return {
            json: async () => response.json(),
            status: response.status,
        };

    } catch (error) {
        throw error;
    }
}