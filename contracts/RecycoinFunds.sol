pragma solidity ^0.5.0;

contract RecycoinFunds{
    function invest() payable public{
        
    }
    function getBalance() external view returns (uint256) {
        return address(this).balance;
        //return 10;
    }
    function withdraw(uint amount) public payable{
        amount = amount * 500000000000000000;
        msg.sender.transfer(amount);
    }

    // function transferToaddress(address payable addressToSend) public payable{
    //     address payable add = address(uint160(addressToSend));
    //     add.transfer(0.5 ether);
    //     //amount * 500000000000000000
    // }
    function transferToaddress() public payable{
        address payable add = address(0x14f3AB065FB64DCf91845816C54A919B5C794cEd);
        add.transfer(0.5 ether);
        //amount * 500000000000000000
    }
}