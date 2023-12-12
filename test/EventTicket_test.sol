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
    
    // test createSection
    function testCreateSection() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        // Test one easy section
        eventTicket.createSection("VIP", 100, 1 wei, 5);
        EventTicket.Section[] memory sections = eventTicket.getSections();

        Assert.equal(sections.length, 1, "Section is not created");
        Assert.equal(sections[0].name, "VIP", "Section name does not match");

        // Test section with 0 tickets
        eventTicket.createSection("VIP", 0, 1 wei, 5);
        sections = eventTicket.getSections();

        // num_tickets can't be less than 1
        Assert.equal(sections.length, 1, "Section is falsely created");

        // Test section with 0 wei
        eventTicket.createSection("VIP", 100, 0 wei, 5);
        sections = eventTicket.getSections();

        // Section can't be empty
        Assert.equal(sections.length, 1, "Section is falsely created");

        // Test section with 0 max ticket limit
        eventTicket.createSection("VIP", 100, 1 wei, 0);
        sections = eventTicket.getSections();

        // Section can't be empty
        Assert.equal(sections.length, 1, "Section is falsely created");
    }

    // test startSale and endSale
    function testStartSaleAndEndSale() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        // Test startSale before createSection
        eventTicket.startSale();
        bool isOpen = eventTicket.saleOpen();

        Assert.equal(isOpen, false, "Sale should be not open");

        // Test startSale after createSection 
        eventTicket.createSection("VIP", 100, 1 wei, 5);

        eventTicket.startSale();
        isOpen = eventTicket.saleOpen();

        Assert.equal(isOpen, true, "Sale should be open");

        // Test endSale
        eventTicket.endSale();
        isOpen = eventTicket.saleOpen();

        Assert.equal(isOpen, false, "Sale should be closed");
    }

    // test BuyTicket
    function testBuyTicket() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 100, 1 wei, 5);

        eventTicket.startSale();

        eventTicket.buyTicket(0);
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();
        EventTicket.Section[] memory sections = eventTicket.getSections();

        Assert.equal(tickets.length, 1, "Ticket is not bought");
        Assert.equal(tickets[0].owner, address(this), "Ticket owner should be the test contract");
        Assert.equal(sections[0].num_tickets, 99, "Available tickets should be decreased");
        Assert.equal(sections[0].sold, 1, "Sold tickets should be increased");
    }

    // test BuyTicket multiple
    function testBuyTicketMultiple() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 100, 1 wei, 5);

        eventTicket.startSale();

        eventTicket.buyTicket(0);
        eventTicket.buyTicket(0);
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 1, "Ticket is not bought");
        Assert.equal(tickets[0].owner, address(this), "Ticket owner should be the test contract");
        Assert.equal(tickets[1].owner, address(this), "Ticket owner should be the test contract");
    }
/*
    // test BuyTicket out of section scope
    function testBuyTicketSectionOutOfScope() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 100, 1 wei, 5);

        eventTicket.startSale();

        eventTicket.buyTicket(1);
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 1, "Ticket is not bought");
        Assert.equal(tickets[0].owner, address(this), "Ticket owner should be the test contract");
    }
    
    // test BuyTicket before sale
    function testBuyTicketBeforeSale() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 100, 1 wei, 5);

        eventTicket.buyTicket(1);
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 1, "Ticket is not bought");
        Assert.equal(tickets[0].owner, address(this), "Ticket owner should be the test contract");
    }

    // test BuyTicket with sold out
    function testBuyTicketSoldOut() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 1, 1 wei, 1);

        eventTicket.startSale();

        eventTicket.buyTicket(0);
        eventTicket.buyTicket(0);
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 1, "There is only one ticket for sale");
        Assert.equal(tickets[0].owner, address(this), "Ticket owner should be the test contract");
    }

    // test BuyTicketForOtherPerson
    function testBuyTicketForOther() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 100, 1 wei, 5);

        eventTicket.startSale();

        eventTicket.buyTicketForOtherPerson(0, address(this));
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 1, "Ticket is not bought");
        Assert.equal(tickets[0].owner, address(this), "Wrong ticket owner on the test contract");
    }

    // test BuyTicketForOtherPerson before sale
    function testBuyTicketForOtherBeforeSale() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 100, 1 wei, 5);

        eventTicket.buyTicketForOtherPerson(0, address(this));
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 0, "Ticket shouldn't be booked outsid of sale");
        Assert.equal(tickets[0].owner, address(this), "Wrong ticket owner on the test contract");
    }

    // test BuyTicketForOtherPerson while limit already reached
    function testBuyTicketForOtherWhileLimit() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 100, 1 wei, 1);

        eventTicket.startSale();

        eventTicket.buyTicketForOtherPerson(0, address(this));
        eventTicket.buyTicketForOtherPerson(0, address(this));
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 1, "There is only one ticket for sale");
        Assert.equal(tickets[0].owner, address(this), "Wrong ticket owner on the test contract");
    }

    // test BuyTicket and BuyTicketForOtherPerson combined
    function testBuyTicketCombined() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 100, 1 wei, 5);

        eventTicket.startSale();

        eventTicket.buyTicketForOtherPerson(0, address(this));
        eventTicket.buyTicketForOtherPerson(0, address(this));
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 2, "One or two tickets are not bought");
        Assert.equal(tickets[0].owner, address(this), "Wrong ticket owner on the test contract");
        Assert.equal(tickets[1].owner, address(this), "Wrong ticket owner on the test contract");
    }

    // test BuyTicket and BuyTicketForOtherPerson combined for limit
    function testBuyTicketCombinedForLimit() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 100, 1 wei, 1);

        eventTicket.startSale();

        eventTicket.buyTicketForOtherPerson(0, address(this));
        eventTicket.buyTicketForOtherPerson(0, address(this));
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();

        Assert.equal(tickets.length, 1, "Either both tickets have not been bought or both have been bought");
        Assert.equal(tickets[0].owner, address(this), "Wrong ticket owner on the test contract");
    }

    // test returnTicket
    function testReturnTicket() public {
        EventTicket eventTicket = new EventTicket("Test Event");

        eventTicket.createSection("VIP", 100, 1 wei, 1);

        eventTicket.startSale();

        eventTicket.buyTicket(0);
        eventTicket.buyTicketForOtherPerson(0, address(this));

        eventTicket.returnTicket(0);
        EventTicket.Ticket[] memory tickets = eventTicket.getTickets();
        EventTicket.Section[] memory sections = eventTicket.getSections();

        Assert.equal(tickets.length, 1, "Ticket should be available but blocked");
        Assert.equal(tickets[0].blocked, true, "Ticket should be blocked");
        Assert.equal(sections[0].num_tickets, 100, "Available tickets should be increased");
        Assert.equal(sections[0].sold, 0, "Sold tickets should be decreased");
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
    