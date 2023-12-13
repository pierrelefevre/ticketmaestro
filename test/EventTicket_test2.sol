// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.4.22 <0.9.0;

// This import is automatically injected by Remix
import "https://raw.githubusercontent.com/pierrelefevre/ticketmaestro/main/test/remix_tests.sol";

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "https://raw.githubusercontent.com/pierrelefevre/ticketmaestro/main/contracts/EventTicket.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract testSuite {
    
    // test BuyTicket
    function testBuyTicket() public payable {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 100, 1 wei, 10);

        eventTicket.startSale();

        // test BuyTicket normal
        eventTicket.buyTicket{value: 1 wei}(0);

        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();
        EventTicket.Section[] memory sections = eventTicket.getSections();

        Assert.equal(tickets.length, 1, "Ticket is not bought");
        Assert.equal(tickets[0].owner, address(this), "Ticket owner should be the test contract");
        Assert.equal(sections[0].num_tickets, 99, "Available tickets should be decreased");
        Assert.equal(sections[0].sold, 1, "Sold tickets should be increased");

        // test BuyTicket ticket limit sell
        eventTicket.endSale();

        eventTicket.createSection("VIP2", 2, 1 wei, 2);

        eventTicket.startSale();

        eventTicket.buyTicket{value: 1 wei}(1);

        tickets = eventTicket.getTickets();
        sections = eventTicket.getSections();

        Assert.equal(tickets.length, 2, "Ticket should be bought");
        Assert.equal(tickets[1].owner, address(this), "Ticket owner should be the test contract");
        Assert.equal(sections[1].num_tickets, 1, "Available tickets should be decreased");
        Assert.equal(sections[1].sold, 1, "Sold tickets should be increased");
    }

    // test BuyTicketForOtherPerson
    function testBuyTicketForOther() public payable {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 10, 1 wei, 10);

        // test BuyTicketForOtherPerson + BuyTicket combined (on limit)
        eventTicket.startSale();

        eventTicket.buyTicketForOtherPerson{value: 1}(0, address(this));
        eventTicket.buyTicket{value: 1}(0);
        eventTicket.buyTicketForOtherPerson{value: 1}(0, address(this));

        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 3, "One or two tickets are not bought");
        Assert.equal(tickets[0].owner, address(this), "Wrong ticket owner on the test contract");
        Assert.equal(tickets[1].owner, address(this), "Wrong ticket owner on the test contract");
        Assert.equal(tickets[2].owner, address(this), "Wrong ticket owner on the test contract");
    }
}
    
