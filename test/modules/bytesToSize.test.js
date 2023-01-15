import { BytesUtility } from "../../src/modules/bytesToSize";

describe("Test BytesUtility", () => {
  it("Check instance", () => {
    const utility = new BytesUtility();
    expect(utility).toBeInstanceOf(BytesUtility);
  });

  it("Test caller BytesUtility", () => {
    expect(BytesUtility.bytesToSize(100)).toBeCalledTimes(1);
  });

  it("Test caller BytesUtility with 0", () => {
    expect(BytesUtility.bytesToSize(100)).toReturn("0 Bytes");
  });

  it("Test apply win controls for windows", () => {
    expect(BytesUtility.bytesToSize(1024)).toReturn("1 Kb");
  });
});
