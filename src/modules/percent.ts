class PercentUtility {
  static percent(bytes: number, total: number): number {
    return Math.round((bytes / total) * 100);
  }
}

export { PercentUtility };
module.exports = { PercentUtility };
