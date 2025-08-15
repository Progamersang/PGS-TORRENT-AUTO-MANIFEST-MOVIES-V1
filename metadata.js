const axios = require('axios');

const CINEMETA_URL = process.env.CINEMETA_URL || 'https://cinemeta.strem.io';

// Lấy metadata phim
async function getMovieMetadata() {
    const response = await axios.get(`${CINEMETA_URL}/stremioget/stremio/v1/q.json?b=eyJwYXJhbXMiOltudWxsLHt9XSwibWV0aG9kIjoibmFtZXMubW92aWUiLCJpZCI6MSwianNvbnJwYyI6IjIuMCJ9`
    );
    return response.data.result.map(item => ({
        name: item.name,
        imdb_id: item.imdb_id,
        type: item.type,
        year: item.year
    }));
}

// Lấy metadata series
async function getSeriesMetadata() {
    const response = await axios.get(`${CINEMETA_URL}/stremioget/stremio/v1/q.json?b=eyJwYXJhbXMiOltudWxsLHt9XSwibWV0aG9kIjoibmFtZXMuc2VyaWVzIiwiaWQiOjEsImpzb25ycGMiOiIyLjAifQ==`
    );
    return response.data.result.map(item => ({
        name: item.name,
        imdb_id: item.imdb_id,
        type: item.type,
        year: item.year
    }));
}

module.exports = { getMovieMetadata, getSeriesMetadata };
