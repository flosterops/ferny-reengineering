function extToImagePath(ext: string): string {
    let res = "../assets/imgs/old-icons16/page.png";
    if(ext === "zip" || ext === "tar" || ext === "wim" || ext === "z") {
        res = "../assets/imgs/old-icons16/archive.png";
    } else
    if(ext === "xls" || ext === "xlsx" || ext === "xlr") {
        res = "../assets/imgs/old-icons16/xls.png";
    } else
    if(ext === "ppt" || ext === "pptx" || ext === "pps") {
        res = "../assets/imgs/old-icons16/ppt.png";
    } else
    if(ext === "bmp" || ext === "ico" || ext === "tga" || ext === "pdn") {
        res = "../assets/imgs/old-icons16/image.png";
    } else
    if(ext === "iso" || ext === "vcd") {
        res = "../assets/imgs/old-icons16/cd.png";
    } else
    if(ext === "db" || ext === "dat" || ext === "sql") {
        res = "../assets/imgs/old-icons16/database.png";
    } else
    if(ext === "dmg") {
        res = "../assets/imgs/old-icons16/dmg.png";
    } else
    if(ext === "csv") {
        res = "../assets/imgs/old-icons16/csv.png";
    } else
    if(ext === "asp") {
        res = "../assets/imgs/old-icons16/asp.png";
    } else
    if(ext === "apk") {
        res = "../assets/imgs/old-icons16/apk.png";
    } else
    if(ext === "cpp") {
        res = "../assets/imgs/old-icons16/cpp.png";
    } else
    if(ext === "cs") {
        res = "../assets/imgs/old-icons16/cs.png";
    } else
    if(ext === "py") {
        res = "../assets/imgs/old-icons16/py.png";
    } else
    if(ext === "otf") {
        res = "../assets/imgs/old-icons16/otf.png";
    } else
    if(ext === "tif" || ext === "tiff") {
        res = "../assets/imgs/old-icons16/tif.png";
    } else
    if(ext === "psd") {
        res = "../assets/imgs/old-icons16/psd.png";
    } else
    if(ext === "svg") {
        res = "../assets/imgs/old-icons16/vector.png";
    } else
    if(ext === "jsp") {
        res = "../assets/imgs/old-icons16/jsp.png";
    } else
    if(ext === "rss") {
        res = "../assets/imgs/old-icons16/rss.png";
    } else
    if(ext === "swift") {
        res = "../assets/imgs/old-icons16/swift.png";
    } else
    if(ext === "nes") {
        res = "../assets/imgs/old-icons16/game.png";
    } else
    if(ext === "torrent") {
        res = "../assets/imgs/old-icons16/torrent.png";
    } else
    if(ext === "vb") {
        res = "../assets/imgs/old-icons16/vb.png";
    } else
    if(ext === "avi") {
        res = "../assets/imgs/old-icons16/avi.png";
    } else
    if(ext === "dll") {
        res = "../assets/imgs/old-icons16/dll.png";
    } else
    if(ext === "pdf") {
        res = "../assets/imgs/old-icons16/pdf.png";
    } else
    if(ext === "flv" || ext === "swf") {
        res = "../assets/imgs/old-icons16/flv.png";
    } else
    if(ext === "c") {
        res = "../assets/imgs/old-icons16/c.png";
    } else
    if(ext === "gitignore") {
        res = "../assets/imgs/old-icons16/git-fork.png";
    } else
    if(ext === "shtml" || ext === "stm" || ext === "shtm") {
        res = "../assets/imgs/old-icons16/server.png";
    } else
    if(ext === "mov") {
        res = "../assets/imgs/old-icons16/mov.png";
    }
    
    return res;
}

export {}
module.exports = extToImagePath;
