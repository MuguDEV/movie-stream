import axios from 'axios';

// Configuration
// Configuration
const YTS_BASE_URL = '/yts';
// Use local proxy path defined in vite.config.js
const SEEDR_BASE_URL = '/seedr';
// CORS Proxy no longer needed for Seedr as Vite proxies it.
// YTS might still need it if it doesn't support CORS, but usually it does.
// If YTS fails, we can add a proxy for it too.
const CORS_PROXY = 'https://corsproxy.io/?';


const api = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000 // 30 second timeout for all requests
});

// Add response interceptor to handle 401s globally
api.interceptors.response.use(
    response => response,
    error => {
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout - server took too long to respond');
        }
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Session expired or unauthorized. Clearing credentials.");
            localStorage.removeItem('seedr_user');
            localStorage.removeItem('seedr_cookies');
            window.dispatchEvent(new Event('seedr:logout'));
        }
        return Promise.reject(error);
    }
);

// Helper function - use YTS images directly without rewriting
const rewriteImageUrls = (data) => {
    // Just return data as-is, load images directly from yts.bz
    return data;
};

// Helper to get headers with cookies and potential Bearer token
const getHeaders = (isForm = false) => {
    const headers = {
        'Content-Type': isForm ? 'application/x-www-form-urlencoded' : 'application/json'
    };

    const storedCookies = localStorage.getItem('seedr_cookies');
    if (storedCookies) {
        try {
            const cookies = JSON.parse(storedCookies);

            // 1. Send as custom header 'x-seedr-cookie'.
            // Vite proxy (vite.config.js) will rewrite this to 'Cookie' before sending to Seedr.
            // This bypasses browser restrictions on setting 'Cookie' header directly.
            const cookieString = cookies.map(c => c.split(';')[0]).join('; ');
            headers['x-seedr-cookie'] = cookieString;

            // 2. Keep Authorization Bearer token as a backup
            const sessionCookie = cookies.find(c => c.trim().startsWith('RSESS_session='));
            if (sessionCookie) {
                const token = sessionCookie.split('=')[1].split(';')[0];
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
            }
        } catch (e) {
            // Silent fail - invalid cookie data
        }
    }
    return headers;
};

export const movies = {
    getTrending: async (page = 1, limit = 8) => {
        const res = await api.get(`${YTS_BASE_URL}/list_movies.json?sort_by=download_count&limit=${limit}&page=${page}`);
        return { ...res, data: rewriteImageUrls(res.data) };
    },
    getTopRated: async (page = 1, limit = 8) => {
        const res = await api.get(`${YTS_BASE_URL}/list_movies.json?sort_by=rating&limit=${limit}&page=${page}`);
        return { ...res, data: rewriteImageUrls(res.data) };
    },
    getAction: async (page = 1, limit = 8) => {
        const res = await api.get(`${YTS_BASE_URL}/list_movies.json?genre=action&limit=${limit}&page=${page}`);
        return { ...res, data: rewriteImageUrls(res.data) };
    },
    getComedy: async (page = 1, limit = 8) => {
        const res = await api.get(`${YTS_BASE_URL}/list_movies.json?genre=comedy&limit=${limit}&page=${page}`);
        return { ...res, data: rewriteImageUrls(res.data) };
    },
    search: async (query) => {
        const res = await api.get(`${YTS_BASE_URL}/list_movies.json?query_term=${query}`);
        return { ...res, data: rewriteImageUrls(res.data) };
    },
    getDetails: async (id) => {
        const res = await api.get(`${YTS_BASE_URL}/movie_details.json?movie_id=${id}&with_images=true&with_cast=true`);
        return { ...res, data: rewriteImageUrls(res.data) };
    },
    getSuggestions: async (id) => {
        const res = await api.get(`${YTS_BASE_URL}/movie_suggestions.json?movie_id=${id}`);
        return { ...res, data: rewriteImageUrls(res.data) };
    },
    getMovies: async (params) => {
        const res = await api.get(`${YTS_BASE_URL}/list_movies.json`, { params });
        return { ...res, data: rewriteImageUrls(res.data) };
    }
};

export const seedr = {
    login: async (username, password) => {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        params.append('rememberme', 'on');
        params.append('cf-turnstile-response', '');

        try {
            // Use local proxy path
            const response = await api.post(`${SEEDR_BASE_URL}/auth/login`, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // Save cookies if present
            if (response.headers['set-cookie']) {
                localStorage.setItem('seedr_cookies', JSON.stringify(response.headers['set-cookie']));
            } else if (response.data && response.data.cookies) {
                // Sometimes API returns cookies in body? Unlikely for Seedr but good fallback
                localStorage.setItem('seedr_cookies', JSON.stringify(response.data.cookies));
            }

            if (response.data && (response.data.success === true || response.data === 'OK')) {
                return response.data;
            }
            return response.data;
        } catch (error) {
            console.error("Seedr login error", error);
            throw error;
        }
    },

    getFiles: async () => {
        return api.get(`${SEEDR_BASE_URL}/fs/folder/0/items`, { headers: getHeaders() });
    },

    getFolder: async (folderId) => {
        return api.get(`${SEEDR_BASE_URL}/fs/folder/${folderId}/items`, { headers: getHeaders() });
    },

    scrapeTorrent: async (url) => {
        const params = new URLSearchParams();
        params.append('url', url);
        return api.post(`${SEEDR_BASE_URL}/scrape/html/torrents`, params, {
            headers: getHeaders(true)
        });
    },

    addMagnet: async (magnet) => {
        const params = new URLSearchParams();
        params.append('folder_id', '0');
        params.append('type', 'torrent');
        params.append('torrent_magnet', magnet);

        return api.post(`${SEEDR_BASE_URL}/task`, params, {
            headers: getHeaders(true)
        });
    },

    deleteItem: async (id) => {
        const params = new URLSearchParams();
        params.append('delete_arr', JSON.stringify([{ type: 'folder', id: id }]));
        return api.post(`${SEEDR_BASE_URL}/fs/batch/delete`, params, {
            headers: getHeaders(true)
        });
    },

    getVideo: async (fileId) => {
        if (!fileId) {
            throw new Error('Invalid file ID');
        }

        // Try the main endpoint first
        try {
            console.log(`Requesting stream URL for file: ${fileId}`);
            const res = await api.get(`${SEEDR_BASE_URL}/presentation/fs/item/${fileId}/video/url`, { 
                headers: getHeaders(),
                timeout: 20000 
            });
            if (res.data && res.data.url) {
                console.log('Got stream URL from primary endpoint');
                return res;
            } else if (res.data) {
                console.warn('Response received but no URL in data:', res.data);
                throw new Error('No stream URL in response');
            }
        } catch (err) {
            console.warn('Primary endpoint failed:', err.message);
            // Fall back to alternative endpoint
        }
        
        // Alternative: Try direct streaming endpoint
        try {
            console.log('Trying alternative endpoint...');
            const res = await api.get(`${SEEDR_BASE_URL}/api/file/${fileId}/stream`, { 
                headers: getHeaders(),
                timeout: 20000 
            });
            if (res.data && res.data.url) {
                console.log('Got stream URL from alternative endpoint');
                return res;
            }
        } catch (err) {
            console.warn('Alternative endpoint failed:', err.message);
        }
        
        // If both fail, throw error
        throw new Error('Unable to get video stream URL from Seedr. Please check your account status and try again.');
    }
};

export default api;
