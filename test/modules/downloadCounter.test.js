import { DownloadCounterController } from "../../src/modules/downloadCounter";

describe("Test BytesUtility", () => {
  it("Check instance", () => {
    const utility = new DownloadCounterController();
    expect(utility).toBeInstanceOf(DownloadCounterController);
  });

  it("Test caller DownloadCounterController increment", () => {
    const DCC = new DownloadCounterController();
    expect(DCC.increment()).toBeCalledTimes(1);
    expect(DCC.increment()).toBeCalledTimes(1);
    expect(DCC.increment()).toBeCalledTimes(1);
    expect(DCC.counter).toEqual(3);
  });

  it("Test caller DownloadCounterController loadDownloadsFolder", () => {
    const DCC = new DownloadCounterController();
    expect(DCC.loadDownloadsFolder()).toBeCalledTimes(1);
  });

  it("Test caller DownloadCounterController loadDownloadCounter", () => {
    const DCC = new DownloadCounterController();
    expect(DCC.loadDownloadCounter()).toBeCalledTimes(1);
  });

  it("Test caller DownloadCounterController saveDownloadCounter", () => {
    const DCC = new DownloadCounterController();
    expect(DCC.saveDownloadCounter()).toBeCalledTimes(1);
  });
});
