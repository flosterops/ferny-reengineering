import { TimeUtility } from "../../src/modules/epochToTime";

describe("Test TimeUtility", () => {
  it("Check instance", () => {
    const utility = new TimeUtility();
    expect(utility).toBeInstanceOf(TimeUtility);
  });

  it("Test caller TimeUtility time 1 ", () => {
    expect(TimeUtility.epochToTime(60)).toEqual("00:60");
  });

  it("Test caller TimeUtility time 2", () => {
    expect(TimeUtility.epochToTime(245)).toEqual("04:05");
  });

  it("Test caller TimeUtility time 3", () => {
    expect(TimeUtility.epochToTime(0)).toEqual("0");
  });
});
