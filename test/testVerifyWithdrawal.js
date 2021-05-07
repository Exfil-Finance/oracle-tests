const ExfilOracle = artifacts.require("./ExfilOracle.sol");
const Tellor = artifacts.require("TellorPlayground.sol");

//Helper function that submits and value and returns a timestamp for easy retrieval
const submitTellorValue = async (tellorOracle, requestId, amount) => {
  //Get the amount of values for that timestamp
  let count = await tellorOracle.getNewValueCountbyRequestId();
  await tellorOracle.submitValue(requestId, amount);
  let time = await getTimestampbyRequestIDandIndex(requestId, count.toString());
  return time.toNumber();
};

contract("ExfilOracle Tests", function (accounts) {
  let exfilUsingTellor;
  let tellorOracle;

  beforeEach("Setup contract for each test", async function () {
    tellorOracle = await Tellor.new();
    exfilUsingTellor = await ExfilOracle.new(tellorOracle.address);
  });

  it("Update State", async function () {
    const requestId = 1337;
    const withdrawalIdValue = "1234567890";
    await tellorOracle.submitValue(requestId, withdrawalIdValue);
    let retrievedVal = await exfilUsingTellor.readTellorValue(requestId);
    assert.equal(retrievedVal.toString(), withdrawalIdValue);
  });
});
