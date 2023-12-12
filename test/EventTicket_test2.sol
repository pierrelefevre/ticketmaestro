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
    
    // test BuyTicket
    function testBuyTicket() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 1, 1 wei, 5);

        // test BuyTicket before sale
        eventTicket.buyTicket(0);

        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 0, "Ticket should not be bought");

        // test BuyTickets out of section scope
        eventTicket.startSale();

        eventTicket.buyTicket(1);

        tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 0, "Ticket should not be bought");

        // test BuyTicket normal
        eventTicket.buyTicket(0);

        tickets = eventTicket.getTickets();
        EventTicket.Section[] memory sections = eventTicket.getSections();

        Assert.equal(tickets.length, 1, "Ticket is not bought");
        Assert.equal(tickets[0].owner, address(this), "Ticket owner should be the test contract");
        Assert.equal(sections[0].num_tickets, 99, "Available tickets should be decreased");
        Assert.equal(sections[0].sold, 1, "Sold tickets should be increased");

        // test BuyTicket ticket limit sell
        eventTicket.buyTicket(0);

        tickets = eventTicket.getTickets();
        sections = eventTicket.getSections();

        Assert.equal(tickets.length, 1, "Ticket should not be bought");
    }

    // test BuyTicketForOtherPerson
    function testBuyTicketForOther() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 2, 1 wei, 5);

        // test BuyTicketForOtherPerson before sale
        eventTicket.buyTicketForOtherPerson(0, address(this));

        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 0, "Ticket shouldn't be able to be booked outside of sale");

        // test BuyTicketForOtherPerson + BuyTicket combined
        eventTicket.startSale();

        eventTicket.buyTicketForOtherPerson(0, address(this));
        eventTicket.buyTicket(0);

        tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 2, "One or two tickets are not bought");
        Assert.equal(tickets[0].owner, address(this), "Wrong ticket owner on the test contract");
        Assert.equal(tickets[1].owner, address(this), "Wrong ticket owner on the test contract");

        // test BuyTicketForOtherPerson + BuyTicket with limit reached
        eventTicket.buyTicketForOtherPerson(0, address(this));

        Assert.equal(tickets.length, 2, "The owner has too many tickets");
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /*

    function testStartSale() public {
        eventTicket.startSale();
        bool isOpen = eventTicket.saleOpen();

        Assert.isTrue(isOpen, "Sale should be open");
    }

    function testBuyTicket() public {
        eventTicket.buyTicket(0, {value: 1 ether});
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 1, "Ticket should be bought");
        Assert.equal(tickets[0].owner, address(this), "Ticket owner should be the test contract");
    }

    function testReturnTicket() public {
        eventTicket.returnTicket(0);
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();
        EventTicket.Section[] memory sections = eventTicket.getSections();

        Assert.equal(tickets[0].blocked, true, "Ticket should be blocked");
        Assert.equal(sections[0].num_tickets, 100, "Available tickets should be increased");
        Assert.equal(sections[0].sold, 0, "Sold tickets should be decreased");
    }*/
}
    