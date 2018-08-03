const { soliditySha3 } = require('web3-utils')

const { assertRevert } = require('@aragon/test-helpers/assertThrow')

var Registry = artifacts.require("./RegistryApp.sol");

contract('Registry', function (accounts) {
  let app

  beforeEach(async () => {
    app = await Registry.new()
    await app.initialize()
  })

  it('adds entries', async function () {
    const receipt = await app.add("foo")
    assert.isTrue(
      receipt.logs.filter((log) => log.event === 'EntryAdded').length === 1,
      'should fire EntryAdded event'
    )
  })

  it('fails adding an already existing entry', async function () {
    const entry = "foo"
    const receipt = await app.add(entry)
    return assertRevert(async() => {
      await app.add(entry)
    })
  })

  it('removes entries', async function () {
    const receipt1 = await app.add("foo")
    var addedEvent = receipt1.logs.filter((log) => log.event === 'EntryAdded')[0]
    var entryId = addedEvent.args.id

    const receipt2 = await app.remove(entryId)
    assert.isTrue(
      receipt2.logs.filter((log) => log.event === 'EntryRemoved').length === 1,
      'should fire EntryRemoved event'
    )
  })

  it('fails removing non-existent entries', async function () {
    const entryId = soliditySha3("foo")
    return assertRevert(async () => {
      await app.remove(entryId)
    })
  })

  it('gets an entry', async function () {
    const entry = "0x666f6f" // "foo"
    const receipt1 = await app.add(entry)
    var addedEvent = receipt1.logs.filter((log) => log.event === 'EntryAdded')[0]
    var entryId = addedEvent.args.id

    assert.equal(await app.get.call(entryId), entry, 'Entry should exist')
  })

  it('checks that an entry exists', async function () {
    const entry = "foo"
    const receipt1 = await app.add(entry)
    var addedEvent = receipt1.logs.filter((log) => log.event === 'EntryAdded')[0]
    var entryId = addedEvent.args.id

    assert.equal(entryId, soliditySha3(entry), "Key should match")
    assert.isTrue(await app.exists.call(entryId), 'Entry should exist')
  })
})
