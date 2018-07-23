var Registry = artifacts.require("./RegistryApp.sol");

contract('Registry', function (accounts) {
  let app

  beforeEach(async () => {
    app = await Registry.new()
    await app.initialize()
  })

  it('should add entries', async function () {
    const receipt = await app.add("foo")
    assert.isTrue(
      receipt.logs.filter((log) => log.event === 'EntryAdded').length === 1,
      'should fire EntryAdded event'
    )
  })

  it('should remove entries', async function () {
    const receipt1 = await app.add("foo")
    var addedEvent = receipt1.logs.filter((log) => log.event === 'EntryAdded')[0]
    var entryId = addedEvent.args.id

    const receipt2 = await app.remove(entryId)
    assert.isTrue(
      receipt2.logs.filter((log) => log.event === 'EntryRemoved').length === 1,
      'should fire EntryRemoved event'
    )
  })

  it('should get an entry', async function () {
    const receipt1 = await app.add("foo")
    var addedEvent = receipt1.logs.filter((log) => log.event === 'EntryAdded')[0]
    var entryId = addedEvent.args.id

    assert.isTrue(await app.exists.call(entryId), 'Entry should exist')
  })
})
