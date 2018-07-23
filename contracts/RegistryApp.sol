pragma solidity ^0.4.15;

import "@aragon/os/contracts/apps/AragonApp.sol";
import "./interfaces/IRegistry.sol";


/**
 * A generic registry app.
 *
 * The registry has three simple operations: `add`, `remove` and `get`.
 *
 * The registry itself is useless, but in combination with other apps to govern
 * the rules for who can add and remove entries in the registry, it becomes
 * a powerful building block (examples are token-curated registries and stake machines).
 */
contract RegistryApp is IRegistry, AragonApp {
    // The entries in the registry.
    mapping(bytes32 => bytes) entries;

    // Fired when an entry is added to the registry.
    event EntryAdded(bytes32 id);
    // Fired when an entry is removed from the registry.
    event EntryRemoved(bytes32 id);

    bytes32 public constant ADD_ENTRY_ROLE = bytes32("ADD_ENTRY_ROLE");
    bytes32 public constant REMOVE_ENTRY_ROLE = bytes32("REMOVE_ENTRY_ROLE");

    /**
     * @notice Initialize App
     */
    function initialize() onlyInit external {
        initialized();
    }

    /**
     * Add an entry to the registry.
     * @param _data The entry to add to the registry
     */
    function add(bytes _data) isInitialized public auth(ADD_ENTRY_ROLE) returns (bytes32 _id) {
        _id = keccak256(_data);
        entries[_id] = _data;

        EntryAdded(_id);
    }

    /**
     * Remove an entry from the registry.
     * @param _id The ID of the entry to remove
     */
    function remove(bytes32 _id) isInitialized public auth(REMOVE_ENTRY_ROLE) {
        delete entries[_id];
        EntryRemoved(_id);
    }

    /**
     * Check if an entry is in the registry.
     * @param _id The ID of the entry to get
     * @return True if it's in the registry, false otherwise
     */
    function exists(bytes32 _id) public view returns (bool) {
        return entries[_id].length > 0;
    }
}
