const { addonBuilder } = require("stremio-addon-sdk");
const ptt = require("parse-torrent-title");
const { searchTPBByImdb } = require("./tpb_search");
const { getMovieMetadata } = require("./metadata");

const manifest = {
    id: "com.stremio.pgstorrrent.addon",
    version: "1.0.0",
    name: "PGS TORRENT AUTO MANIFEST MOVIES V1",
    description: "Auto manifest movies, series, anime and more imported from many sources (torrends.to, TorrentGalaxy, TPB, YTS, EZTVx, rarbg, 1337x, BluDV, toorgle, Community Movies, Internet Movies,...). Supports formats like .mp4, .mkv. Link github support me: https://github.com/Progamersang/PGS-TORRENT-AUTO-MANIFEST-MOVIES-V1",
    resources: ["stream"],
    types: ["movie", "series"],
    catalogs: [],
    idPrefixes: ["tt"]
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler(async function(args) {
    if (args.type === 'movie' || args.type === 'series') {
        
        // ✅ THAY ĐỔI QUAN TRỌNG NẰM Ở ĐÂY
        // Tách lấy IMDb ID gốc từ ID mà Stremio cung cấp.
        // Ví dụ: từ 'tt13443470:2:4' -> lấy 'tt13443470'
        // Đối với phim, nó vẫn là 'tt...' nên không bị ảnh hưởng.
        const imdbId = args.id.split(':')[0];

        console.log(`🔍 Yêu cầu stream cho ${args.type}: ${args.id}. Sử dụng IMDb ID: ${imdbId}`);

        // 1. Tìm kiếm torrent trên TPB bằng IMDb ID đã được xử lý
        const torrents = await searchTPBByImdb(imdbId);
        if (!torrents || torrents.length === 0) {
            console.log(`🚫 Không tìm thấy torrent nào cho ${imdbId}`);
            return Promise.resolve({ streams: [] });
        }
        
        console.log(`✅ Tìm thấy ${torrents.length} torrents cho ${imdbId}`);

        // 2. Chuyển đổi kết quả torrent thành định dạng stream mà Stremio hiểu
        const streams = torrents.map(torrent => {
            const titleInfo = ptt.parse(torrent.title);
            const quality = titleInfo.resolution || 'SD';

            return {
                name: `[PGSTORRENT] ${quality}`,
                title: `${torrent.title}\n👤 ${torrent.seeders} | 💾 ${torrent.size}`,
                infoHash: torrent.info_hash,
            };
        });

        // 3. Trả về danh sách các stream
        return Promise.resolve({ streams: streams });
    } else {
        return Promise.resolve({ streams: [] });
    }
});

module.exports = builder.getInterface();
