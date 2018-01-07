var Registry = artifacts.require("./RegistryApp.sol");

contract('Registry', function (accounts) {
  describe('#add', function () {
    it('should add entries', function () {
      return Registry.deployed().then((instance) => {
        return instance.add("foo")
      }).then((receipt) => {
        assert.isTrue(
          receipt.logs.filter((log) => log.event === 'EntryAdded').length === 1,
          'should fire EntryAdded event'
        )
      })
    })
  })

  describe('#remove', function () {
    it('should remove entries', async function () {
      const instance = await Registry.deployed()

      return instance.add("foo").then((receipt) => {
        var addedEvent = receipt.logs.filter((log) => log.event === 'EntryAdded')[0]
        var entryId = addedEvent.args.id

        return instance.remove(entryId)
      }).then((receipt) => {
        assert.isTrue(
          receipt.logs.filter((log) => log.event === 'EntryRemoved').length === 1,
          'should fire EntryRemoved event'
        )
      })
    })
  })

  describe('#get', function () {
    it('should get an entry', async function () {
      const instance = await Registry.deployed()

      return instance.add("foo").then((receipt) => {
        var addedEvent = receipt.logs.filter((log) => log.event === 'EntryAdded')[0]
        var entryId = addedEvent.args.id

        return instance.get.call(entryId)
      }).then((returnData) => {
        const FOO_IN_BYTES32 = '0x666f6f0000000000000000000000000000000000000000000000000000000000'
        assert.equal(returnData, FOO_IN_BYTES32)
      })
    })
  })
})
