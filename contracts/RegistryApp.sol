pragma solidity ^0.4.15;

import "@aragon/core/contracts/apps/App.sol";

/**
 * A generic registry app.
 *
 * The registry has three simple operations: `add`, `remove` and `get`.
 *
 * The registry itself is useless, but in combination with other apps to govern
 * the rules for who can add and remove entries in the registry, it becomes
 * a powerful building block (examples are token-curated registries and stake machines).
 */
contract RegistryApp is App {
    // The entries in the registry.
    mapping(bytes32 => bytes32) entries;

    // Fired when an entry is added to the registry.
    event EntryAdded(bytes32 id);
    // Fired when an entry is removed from the registry.
    event EntryRemoved(bytes32 id);

    bytes32 public constant ADD_ENTRY_ROLE = bytes32(1);
    bytes32 public constant REMOVE_ENTRY_ROLE = bytes32(2);

    /**
     * Add an entry to the registry.
     * @param _data The entry to add to the registry
     */
    function add(
        bytes32 _data
    ) public auth(ADD_ENTRY_ROLE) returns (bytes32 _id) {
        _id = keccak256(_data);
        entries[_id] = _data;

        EntryAdded(_id);
    }

    /**
     * Remove an entry from the registry.
     * @param _id The ID of the entry to remove
     */
    function remove(
        bytes32 _id
    ) public auth(REMOVE_ENTRY_ROLE) {
        delete entries[_id];
        EntryRemoved(_id);
    }

    /**
     * Get an entry from the registry.
     * @param _id The ID of the entry to get
     */
    function get(
        bytes32 _id
    ) public constant returns (bytes32) {
        return entries[_id];
    }
}
