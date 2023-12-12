// SPDX-License-Identifier: GPL-3.0
        
pragma solidity >=0.4.22 <0.9.0;

// This import is automatically injected by Remix
import "remix_tests.sol";

// This import is required to use custom transaction context
// Although it may fail compilation in 'Solidity Compiler' plugin
// But it will work fine in 'Solidity Unit Testing' plugin
import "remix_accounts.sol";
import "./EventTicket.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract testSuite {

    // test returnTicket
    function testReturnTicket() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 100, 1 wei, 1);

        eventTicket.startSale();

        // test returnTicket before ticket bought
        eventTicket.returnTicket(0);

        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 0, "There shouldn't be any ticket to return");

        // test returnTicket with wrong ID
        eventTicket.buyTicket(0);

        eventTicket.returnTicket(50);

        tickets = eventTicket.getTickets();
        EventTicket.Section[] memory sections = eventTicket.getSections();

        Assert.equal(tickets.length, 1, "Ticket should be available");
        Assert.equal(tickets[0].blocked, false, "Ticket should not be blocked");
        Assert.equal(sections[0].num_tickets, 99, "Available tickets should be decreased");
        Assert.equal(sections[0].sold, 1, "Sold tickets should be increased");

        // test returnTicket normal
        eventTicket.returnTicket(0);

        tickets = eventTicket.getTickets();
        sections = eventTicket.getSections();

        Assert.equal(tickets.length, 1, "Ticket should be available but blocked");
        Assert.equal(tickets[0].blocked, true, "Ticket should be blocked");
        Assert.equal(sections[0].num_tickets, 100, "Available tickets should be increased");
        Assert.equal(sections[0].sold, 0, "Sold tickets should be decreased");

        // test returnTicket after checke
        eventTicket.buyTicket(0);

        eventTicket.checke(1);

        eventTicket.returnTicket(1);

        Assert.equal(tickets.length, 2, "Ticket should be available but blocked");
        Assert.equal(tickets[1].used, true, "Ticket should be used");
        Assert.equal(tickets[1].used, false, "Ticket should not be blocked");

        // test returnTicket for anotherPerson
        eventTicket.buyTicketForOtherPerson(0, 0xdD870fA1b7C4700F2BD7f44238821C26f7392148);

        eventTicket.returnTicket(2);

        Assert.equal(tickets.length, 3, "Ticket should be available");
        Assert.equal(tickets[2].used, false, "Ticket should not be used");
        Assert.equal(tickets[2].used, false, "Ticket should not be blocked");
    }
}
    