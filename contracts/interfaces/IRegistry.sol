pragma solidity ^0.4.18;


interface IRegistry {
    function add(bytes _data) public returns (bytes32 _id);
    function remove(bytes32 _id) public;
    function exists(bytes32 _id) public view returns (bool);
}


contract FakeRegistry {
    // to work around coverage issue
    function fake() public {
        // for lint
    }
}
