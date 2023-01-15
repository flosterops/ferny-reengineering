import { DateUtility } from "../../src/modules/epochToDate";

describe("Test DateUtility", () => {
  it("Check instance", () => {
    const utility = new DateUtility();
    expect(utility).toBeInstanceOf(DateUtility);
  });

  it("Test caller DownloadCounterController increment", () => {
    expect(DateUtility.numberToMonth(0)).toEqual("January");
  });

  it("Test caller DownloadCounterController increment", () => {
    expect(DateUtility.epochToDate(Date.now())).toBeCalledTimes(1);
  });
});
