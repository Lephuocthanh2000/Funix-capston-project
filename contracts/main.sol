//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Session.sol";
import "./SharedStruct.sol";

contract Main is SharedStruct {
    address[] public participantKeys;

    mapping(address => Participant) public infoParticipant;
    mapping(address => bool) public isSession;
    //The smart contract should contain the hash of all the pricing sessions.
    Session[] public sessions;
    mapping(uint => address) public addressOfSession;
    // The account deployed the main smart contract will be set as admin account
    // contract address vs address
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Must be Admin can be action");
        _;
    }
    modifier validParticipant() {
        require(
            infoParticipant[msg.sender].account != address(0),
            "Not registered"
        );
        _;
    }

    modifier onlySessionContract() {
        require(isSession[msg.sender] == true, "Not session");
        _;
    }

    //------------------------------- participant ------------------------------
    function checkRegistered()
        external
        view
        validParticipant
        returns (address)
    {
        return msg.sender;
    }

    function register(
        string memory _fullName,
        string memory _email
    ) external returns (bool) {
        //only for address that has not registered
        require(
            infoParticipant[msg.sender].account == address(0),
            "Participant has already registered"
        );
        require(
            bytes(_fullName).length > 0 && bytes(_email).length > 0,
            "Please fill in both your full name and email address"
        );
        Participant memory newParticipant = Participant({
            account: msg.sender,
            fullName: _fullName,
            email: _email,
            numberOfJoinedSession: 0,
            deviation: 0
        });

        infoParticipant[msg.sender] = newParticipant;
        participantKeys.push(msg.sender);
        return true;
    }

    function getListParticipants()
        external
        view
        onlyAdmin
        returns (Participant[] memory)
    {
        Participant[] memory _participants = new Participant[](
            participantKeys.length
        );
        for (uint256 i = 0; i < participantKeys.length; i++) {
            _participants[i] = infoParticipant[participantKeys[i]];
        }
        return _participants;
    }

    function getParticipant()
        external
        view
        validParticipant
        returns (Participant memory)
    {
        return infoParticipant[msg.sender];
    }

    function createNewSession(
        string memory _productName,
        string memory _productDescription,
        string[] memory _productImages,
        uint256 _sessionDuration
    ) public onlyAdmin returns (Session) {
        Session newSession = new Session(
            address(this),
            admin,
            _productName,
            _productDescription,
            _productImages,
            0,
            0,
            _sessionDuration
        );

        sessions.push(newSession);
        addressOfSession[sessions.length - 1] = address(newSession);
        isSession[address(newSession)] = true;
        return newSession;
    }

    function getIsSession(address _addressSession) public view returns (bool) {
        return isSession[_addressSession];
    }

    // function updateParticipantDeviation(
    //     address _account,
    //     uint256 _deviation
    // ) external onlySessionContract {
    //     participants[_account].deviation = _deviation;
    // }

    // function incrementParticipantNumberOfSession(
    //     address _account
    // ) external onlySessionContract {
    //     participants[_account].numberOfJoinedSession += 1;
    // }

    // function updateSessionDetail(
    //     address _sessionAddress,
    //     string memory _productName,
    //     string memory _productDescription,
    //     string[] memory _productImages
    // ) public onlyAdmin {
    //     Session _session = Session(_sessionAddress);
    //     _session.updateSessionDetail(
    //         _productName,
    //         _productDescription,
    //         _productImages
    //     );
    // }

    // function getSessions() external view returns (SessionDetail[] memory) {
    //     SessionDetail[] memory _sessionsDetail = new SessionDetail[](
    //         sessions.length
    //     );

    //     for (uint256 i = 0; i < sessions.length; i++) {
    //         SessionDetail memory sessionDetail = sessions[i].getSessionDetail();
    //         _sessionsDetail[i] = sessionDetail;
    //     }
    //     return _sessionsDetail;
    // }

    // function updateParticipantDetail(
    //     string memory _fullName,
    //     string memory _email
    // ) public validParticipant {
    //     participants[msg.sender].fullName = _fullName;
    //     participants[msg.sender].email = _email;
    // }
    function getAddressSession(
        uint _index
    ) public view onlyAdmin returns (address) {
        return (addressOfSession[_index]);
    }
}
