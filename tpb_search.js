const axios = require('axios');
const { getMovieMetadata, getSeriesMetadata } = require('./metadata');

const TPB_URL = process.env.TPB_URL || 'https://apibay.org';

function formatSize(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// Tìm torrent theo IMDb ID từ TPB
async function searchTPBByImdb(imdbId) {
    const response = await axios.get(`${TPB_URL}/q.php?q=${imdbId}`);
    return response.data.map(t => ({
        title: t.name,
        info_hash: t.info_hash,
        size: formatSize(parseInt(t.size)),
        id_imdb: t.imdb,
        seeders: t.seeders,
        leechers: t.leechers
    }));
}

module.exports = { searchTPBByImdb }
