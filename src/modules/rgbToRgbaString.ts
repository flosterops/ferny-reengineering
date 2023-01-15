class ColorsUtility {
  static rgbToRgbaString(rgb: string): string {
    const arr = rgb.replace(/[^\d,]/g, "").split(",");
    return "rgba(" + arr[0] + ", " + arr[1] + ", " + arr[2] + ", 0.25)";
  }
}

export { ColorsUtility };
module.exports = { ColorsUtility };
