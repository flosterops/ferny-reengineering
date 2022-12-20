function extToImagePath(ext) {
    let res = "../imgs/old-icons16/page.png";
    if(ext === "zip" || ext === "tar" || ext === "wim" || ext === "z") {
        res = "../imgs/old-icons16/archive.png";
    } else
    if(ext === "xls" || ext === "xlsx" || ext === "xlr") {
        res = "../imgs/old-icons16/xls.png";
    } else
    if(ext === "ppt" || ext === "pptx" || ext === "pps") {
        res = "../imgs/old-icons16/ppt.png";
    } else
    if(ext === "bmp" || ext === "ico" || ext === "tga" || ext === "pdn") {
        res = "../imgs/old-icons16/image.png";
    } else
    if(ext === "iso" || ext === "vcd") {
        res = "../imgs/old-icons16/cd.png";
    } else
    if(ext === "db" || ext === "dat" || ext === "sql") {
        res = "../imgs/old-icons16/database.png";
    } else
    if(ext === "dmg") {
        res = "../imgs/old-icons16/dmg.png";
    } else
    if(ext === "csv") {
        res = "../imgs/old-icons16/csv.png";
    } else
    if(ext === "asp") {
        res = "../imgs/old-icons16/asp.png";
    } else
    if(ext === "apk") {
        res = "../imgs/old-icons16/apk.png";
    } else
    if(ext === "cpp") {
        res = "../imgs/old-icons16/cpp.png";
    } else
    if(ext === "cs") {
        res = "../imgs/old-icons16/cs.png";
    } else
    if(ext === "py") {
        res = "../imgs/old-icons16/py.png";
    } else
    if(ext === "otf") {
        res = "../imgs/old-icons16/otf.png";
    } else
    if(ext === "tif" || ext === "tiff") {
        res = "../imgs/old-icons16/tif.png";
    } else
    if(ext === "psd") {
        res = "../imgs/old-icons16/psd.png";
    } else
    if(ext === "svg") {
        res = "../imgs/old-icons16/vector.png";
    } else
    if(ext === "jsp") {
        res = "../imgs/old-icons16/jsp.png";
    } else
    if(ext === "rss") {
        res = "../imgs/old-icons16/rss.png";
    } else
    if(ext === "swift") {
        res = "../imgs/old-icons16/swift.png";
    } else
    if(ext === "nes") {
        res = "../imgs/old-icons16/game.png";
    } else
    if(ext === "torrent") {
        res = "../imgs/old-icons16/torrent.png";
    } else
    if(ext === "vb") {
        res = "../imgs/old-icons16/vb.png";
    } else
    if(ext === "avi") {
        res = "../imgs/old-icons16/avi.png";
    } else
    if(ext === "dll") {
        res = "../imgs/old-icons16/dll.png";
    } else
    if(ext === "pdf") {
        res = "../imgs/old-icons16/pdf.png";
    } else
    if(ext === "flv" || ext === "swf") {
        res = "../imgs/old-icons16/flv.png";
    } else
    if(ext === "c") {
        res = "../imgs/old-icons16/c.png";
    } else
    if(ext === "gitignore") {
        res = "../imgs/old-icons16/git-fork.png";
    } else
    if(ext === "shtml" || ext === "stm" || ext === "shtm") {
        res = "../imgs/old-icons16/server.png";
    } else
    if(ext === "mov") {
        res = "../imgs/old-icons16/mov.png";
    }
    
    return res;
}

export {}
module.exports = extToImagePath;
