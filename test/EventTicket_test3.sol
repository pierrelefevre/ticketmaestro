// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.4.22 <0.9.0;

// This import is automatically injected by Remix
import "./remix_tests.sol";

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "../contracts/EventTicket.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract testSuite3 {
    
    // test checke
    function testchecke() public payable {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 5, 1 wei, 5);

        eventTicket.startSale();

        eventTicket.buyTicket{value: 1 wei}(0);

        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        eventTicket.checke(0);

        Assert.equal(tickets[0].used, true, "Ticket should be marked as used");
        Assert.equal(tickets.length, 1, "There must be one ticket");
        Assert.equal(tickets[0].owner, address(this), "Wrong ticket owner on the test contract");
    }
}
    
