function percent(bytes: number, total: number): number {
    return Math.round((bytes / total) * 100);
}

export {}
module.exports = percent;
