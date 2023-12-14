const EventTicket = artifacts.require('EventTicket');

contract('EventTicket', (accounts) => {
    it('should create one section', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 1000, 1, 10);
        const sections = await eventTicket.getSections();

        assert.equal(sections.length, 1, 'Section is not created');
        assert.equal(sections[0].name, 'VIP', 'Section name does not match');
        assert.equal(sections[0].num_tickets, 1000, 'Num_tickets do not match');
        assert.equal(sections[0].price, 1, 'Num_tickets do not match');
    });

    it('should create multiple sections', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 1000, 1000, 2);
        await eventTicket.createSection('Category 1', 4000, 500, 4);
        await eventTicket.createSection('Category 2', 5000, 200, 4);
        await eventTicket.createSection('Category 3', 10000, 75, 8);
        await eventTicket.createSection('Category 4', 20000, 25, 10);

        const sections = await eventTicket.getSections();

        assert.equal(sections.length, 5, 'Section is not created');
        assert.equal(sections[0].name, 'VIP', 'Section name does not match');
        assert.equal(sections[0].num_tickets, 1000, 'Num_tickets do not match');
        assert.equal(sections[0].price, 1000, 'Price do not match');
        assert.equal(sections[1].name, 'Category 1', 'Section name does not match');
        assert.equal(sections[1].num_tickets, 4000, 'Num_tickets do not match');
        assert.equal(sections[1].price, 500, 'Price do not match');
        assert.equal(sections[2].name, 'Category 2', 'Section name does not match');
        assert.equal(sections[2].num_tickets, 5000, 'Num_tickets do not match');
        assert.equal(sections[2].price, 200, 'Price do not match');
        assert.equal(sections[3].name, 'Category 3', 'Section name does not match');
        assert.equal(sections[3].num_tickets, 10000, 'Num_tickets do not match');
        assert.equal(sections[3].price, 75, 'Price do not match');
        assert.equal(sections[4].name, 'Category 4', 'Section name does not match');
        assert.equal(sections[4].num_tickets, 20000, 'Num_tickets do not match');
        assert.equal(sections[4].price, 25, 'Price do not match');
    });

    it('should create section with minimum requirements + number as string name', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        // Test minimum requirements + number as string
        await eventTicket.createSection('1', 1, 1, 1);
        const sections = await eventTicket.getSections();

        assert.equal(sections.length, 1, 'Section is not created');
        assert.equal(sections[0].name, '1', 'Section name does not match');
        assert.equal(sections[0].num_tickets, 1, 'Num_tickets do not match');
        assert.equal(sections[0].price, 1, 'Price is wrong');
    });

    it('should not create a section during sale', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 1000, 1, 10);

        await eventTicket.startSale();

	try {
            await eventTicket.createSection('Category 1', 4000, 500, 4);
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const sections = await eventTicket.getSections();
            assert.equal(sections.length, 0, 'Section should not be created');
        }
    });

    it('should not create a section with price less than 1', async () => {
        const eventTicket = await EventTicket.new('Test Event');

	try {
            await eventTicket.createSection('VIP', 1000, 0, 10);
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const sections = await eventTicket.getSections();
            assert.equal(sections.length, 0, 'Section should not be created');
        }
    });

    it('should not create a section with offered number of tickets less than 1', async () => {
        const eventTicket = await EventTicket.new('Test Event');

	try {
            await eventTicket.createSection('VIP', 0, 1, 10);
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const sections = await eventTicket.getSections();
	    assert.equal(sections.length, 0, 'Section should not be created');
        }
    });

    it('should not create a section with maximum number of tickets less than 1', async () => {
        const eventTicket = await EventTicket.new('Test Event');

	try {
            await eventTicket.createSection('VIP', 1000, 1, 0);
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const sections = await eventTicket.getSections();
	    assert.equal(sections.length, 0, 'Section should not be created');
        }
    });

    it('should not be sale before start', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);

        const isOpen = await eventTicket.saleOpen();
        assert.equal(isOpen, false, 'Sale should be closed');
    });

    it('should start sale', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);

        await eventTicket.startSale();

        const isOpen = await eventTicket.saleOpen();
        assert.equal(isOpen, true, 'Sale should be open');
    });

    it('should end sale', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);

        await eventTicket.startSale();

        await eventTicket.endSale();

        const isOpen = await eventTicket.saleOpen();
        assert.equal(isOpen, false, 'Sale should be closed');
    });

    it('should restart and reend sale', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);

        await eventTicket.startSale();

        await eventTicket.endSale();

        // Test reopen openSale and endSale again        
        await eventTicket.startSale();
        const isOpenAfterReopen = await eventTicket.saleOpen();
        assert.equal(isOpenAfterReopen, true, 'Sale should be open');

        await eventTicket.endSale();
        const isOpenAfterSecondEnd = await eventTicket.saleOpen();
        assert.equal(isOpenAfterSecondEnd, false, 'Sale should be closed');
    });

    it('should not start sale twice', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);

        await eventTicket.startSale();

        try {
            await eventTicket.startSale();
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const isOpen = await eventTicket.saleOpen();
            assert.equal(isOpen, true, 'Sale should be opened');
        }
    });

    it('should not start sale before created section', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        try {
            await eventTicket.startSale();
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const isOpen = await eventTicket.saleOpen();
            assert.equal(isOpen, false, 'Sale should be closed');
        }
    });

    it('should not end sale before started sale', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        try {
            await eventTicket.endSale();
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const isOpen = await eventTicket.saleOpen();
            assert.equal(isOpen, false, 'Sale should be closed');
        }
    });

    it('should buy one ticket', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);
        await eventTicket.startSale();
        await eventTicket.buyTicket(0, {value: 1});

        const tickets = await eventTicket.getTickets();
        const sections = await eventTicket.getSections();

        assert.equal(tickets.length, 1, 'Ticket is not bought');
        assert.equal(tickets[0].owner, accounts[0], 'Ticket owner should be the test contract');
        assert.equal(sections[0].num_tickets, 99, 'Available tickets should be decreased');
        assert.equal(sections[0].sold, 1, 'Sold tickets should be increased');
    });

    it('should buy multiple tickets', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);
        await eventTicket.startSale();
        await eventTicket.buyTicket(0, {value: 1});
        await eventTicket.buyTicket(0, {value: 1});

        const tickets = await eventTicket.getTickets();

        assert.equal(tickets.length, 2, 'Tickets are not bought');
        assert.equal(tickets[0].owner, accounts[0], 'Ticket owner should be the test contract');
        assert.equal(tickets[1].owner, accounts[0], 'Ticket owner should be the test contract');
    });

    it('should not buy a ticket out of section scope', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);
        await eventTicket.startSale();

        try {
            await eventTicket.buyTicket(1, {value: 1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 0, 'Ticket should not be bought');
        }
    });

    it('should not buy a ticket of a section that is sold out', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 1, 1, 5);
        await eventTicket.startSale();
        await eventTicket.buyTicket(0, {value: 1});

        try {
            await eventTicket.buyTicket(0, {value: 1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 1, 'Ticket should not be bought');
        }
    });

    it('should not buy a ticket if it exceeds maximum limit', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 1);
        await eventTicket.startSale();
        await eventTicket.buyTicket(0, {value: 1});

        try {
            await eventTicket.buyTicket(0, {value: 1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 1, 'Ticket should not be bought');
        }
    });

    it('should not buy a ticket if full price is not paid', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 100, 1);
        await eventTicket.startSale();

        try {
            await eventTicket.buyTicket(0, {value: 99});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 0, 'Ticket should not be bought');
        }
    });

    it('should not buy a ticket before sale', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);

        try {
            await eventTicket.buyTicket(0, {value: 1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 0, 'Ticket should not be bought');
        }
    });

    it('should buy a ticket for other person', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);
        await eventTicket.startSale();
        await eventTicket.buyTicketForOtherPerson(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value:1});

        const tickets = await eventTicket.getTickets();

        assert.equal(tickets.length, 1, 'Ticket is not bought');
        assert.equal(tickets[0].owner, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', 'Wrong ticket owner on the test contract');
    });

    it('should not buy a ticket for other person before sale', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);

        try {
            await eventTicket.buyTicketForOtherPerson(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value:1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 0, "Ticket shouldn't be booked outside of sale");
        }
    });

    it('should not buy a ticket for other person while limit already reached', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 1);
        await eventTicket.startSale();

        await eventTicket.buyTicketForOtherPerson(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value:1});
        try {
            await eventTicket.buyTicketForOtherPerson(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value:1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 1, 'There is only one ticket for sale');
        }
    });

    it('should not buy a ticket for others out of section scope', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);
        await eventTicket.startSale();

        try {
            await eventTicket.buyTicketForOtherPerson(1, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value: 1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 0, 'Ticket should not be bought');
        }
    });

    it('should not buy a ticket of a section that is sold out', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 1, 1, 5);
        await eventTicket.startSale();
        await eventTicket.buyTicketForOtherPerson(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value: 1});

        try {
            await eventTicket.buyTicket(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value: 1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 1, 'Ticket should not be bought');
        }
    });

    it('should not buy a ticket for others if full price is not paid', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 100, 1);
        await eventTicket.startSale();

        try {
            await eventTicket.buyTicketForOtherPerson(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value: 99});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 0, 'Ticket should not be bought');
        }
    });

    it('should buy a ticket and a ticket for other person combined', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 5);
        await eventTicket.startSale();

        await eventTicket.buyTicketForOtherPerson(0, accounts[0], {value:1});
        await eventTicket.buyTicket(0, {value: 1});

        const tickets = await eventTicket.getTickets();

        assert.equal(tickets.length, 2, 'One or two tickets are not bought');
        assert.equal(tickets[0].owner, accounts[0], 'Wrong ticket owner on the test contract');
        assert.equal(tickets[1].owner, accounts[0], 'Wrong ticket owner on the test contract');
    });

    it('should buy a ticket for other person (own person here) but not an additional ticket (reach the limit after the first)', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 100, 1, 1);
        await eventTicket.startSale();

        await eventTicket.buyTicketForOtherPerson(0, accounts[0], {value:1});

        try {
            await eventTicket.buyTicket(0, {value: 1});
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            assert.equal(tickets.length, 1, 'Either both tickets have not been bought or both have been bought');
            assert.equal(tickets[0].owner, accounts[0], 'Wrong ticket owner on the test contract');
        }
    });

    it('should return a ticket', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 5, 1, 5);
        await eventTicket.startSale();

        await eventTicket.buyTicket(0, {value: 1});

        await eventTicket.returnTicket(0);

        const tickets = await eventTicket.getTickets();
        const sections = await eventTicket.getSections();

        assert.equal(tickets.length, 1, 'Ticket should be available but blocked');
        assert.equal(tickets[0].blocked, true, 'Ticket should be blocked');
        assert.equal(sections[0].num_tickets, 5, 'Available tickets should be increased');
        assert.equal(sections[0].sold, 0, 'Sold tickets should be decreased');
    });

    it('should return multiple tickets', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 5, 1, 5);
        await eventTicket.startSale();

        await eventTicket.buyTicket(0, {value: 1});
        await eventTicket.buyTicket(0, {value: 1});
        await eventTicket.buyTicket(0, {value: 1});

        await eventTicket.returnTicket(0);
        await eventTicket.returnTicket(2);

        const tickets = await eventTicket.getTickets();
        const sections = await eventTicket.getSections();

        assert.equal(tickets.length, 1, 'Ticket should be available but blocked');
        assert.equal(tickets[0].blocked, true, 'Ticket should be blocked');
        assert.equal(tickets[1].blocked, false, 'Ticket should be blocked');
        assert.equal(tickets[2].blocked, true, 'Ticket should be blocked');
        assert.equal(sections[0].num_tickets, 5, 'Available tickets should be increased');
        assert.equal(sections[0].sold, 0, 'Sold tickets should be decreased');
    });

    it('should not return a ticket that is not ones own', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 5, 1, 5);
        await eventTicket.startSale();

        await eventTicket.buyTicketForOtherPerson(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value:1});

        try {
            await eventTicket.returnTicket(0);
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            const sections = await eventTicket.getSections();

            assert.equal(tickets.length, 1, 'Ticket should be available and not blocked');
            assert.equal(tickets[0].blocked, false, 'Ticket should be blocked');
            assert.equal(sections[0].num_tickets, 4, 'Available tickets should be the same');
            assert.equal(sections[0].sold, 1, 'Sold tickets should be the same');
        }
    });

    it('should not return a ticket that is not ones own', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 5, 1, 5);
        await eventTicket.startSale();

        await eventTicket.buyTicketForOtherPerson(0, '0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB', {value:1});

        try {
            await eventTicket.returnTicket(0);
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            const sections = await eventTicket.getSections();

            assert.equal(tickets.length, 1, 'Ticket should be available and not blocked');
            assert.equal(tickets[0].blocked, false, 'Ticket should not be blocked');
            assert.equal(sections[0].num_tickets, 4, 'Available tickets should be the same');
            assert.equal(sections[0].sold, 1, 'Sold tickets should be the same');
        }
    });

    it('should not return a ticket when sale is over', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 5, 1, 5);

        await eventTicket.startSale();
        await eventTicket.buyTicket(0, {value:1});

        await eventTicket.endSale();

        try {
            await eventTicket.returnTicket(0);
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            const sections = await eventTicket.getSections();

            assert.equal(tickets.length, 1, 'Ticket should be available and not blocked');
            assert.equal(tickets[0].blocked, false, 'Ticket should not be blocked');
            assert.equal(sections[0].num_tickets, 4, 'Available tickets should be the same');
            assert.equal(sections[0].sold, 1, 'Sold tickets should be the same');
        }
    });

    it('should not return a ticket with unvalid ID', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 5, 1, 5);

        await eventTicket.startSale();
        await eventTicket.buyTicket(0, {value:1});

        await eventTicket.endSale();

        try {
            await eventTicket.returnTicket(50);
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            const sections = await eventTicket.getSections();

            assert.equal(tickets.length, 1, 'Ticket should be available and not blocked');
            assert.equal(tickets[0].blocked, false, 'Ticket should not be blocked');
            assert.equal(sections[0].num_tickets, 4, 'Available tickets should be the same');
            assert.equal(sections[0].sold, 1, 'Sold tickets should be the same');
        }
    });

    it('should not return a ticket with unvalid ID', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 5, 1, 5);

        await eventTicket.startSale();
        await eventTicket.buyTicket(0, {value:1});

        await eventTicket.endSale();

        try {
            await eventTicket.returnTicket(50);
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            const sections = await eventTicket.getSections();

            assert.equal(tickets.length, 1, 'Ticket should be available and not blocked');
            assert.equal(tickets[0].blocked, false, 'Ticket should not be blocked');
            assert.equal(sections[0].num_tickets, 4, 'Available tickets should be the same');
            assert.equal(sections[0].sold, 1, 'Sold tickets should be the same');
        }
    });

    it('should not return a ticket twice', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 5, 1, 5);
        await eventTicket.startSale();
        await eventTicket.buyTicket(0, {value:1});
        await eventTicket.endSale();
        await eventTicket.returnTicket(0);

        try {
            await eventTicket.returnTicket(0);
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            const sections = await eventTicket.getSections();

            assert.equal(tickets.length, 1, 'Ticket should be available and blocked');
            assert.equal(tickets[0].blocked, true, 'Ticket should be blocked');
            assert.equal(sections[0].num_tickets, 4, 'Available tickets should be the same');
            assert.equal(sections[0].sold, 1, 'Sold tickets should be the same');
        }
    });

    it('should not return after being used', async () => {
        const eventTicket = await EventTicket.new('Test Event');

        await eventTicket.createSection('VIP', 5, 1, 5);
        await eventTicket.startSale();
        await eventTicket.buyTicket(0, {value:1});
        await eventTicket.endSale();
        await eventTicket.checkIn(0);

        try {
            await eventTicket.returnTicket(0);
            assert.fail('Should have thrown an exception');
        } catch (error) {
            const tickets = await eventTicket.getTickets();
            const sections = await eventTicket.getSections();

            assert.equal(tickets.length, 1, 'Ticket should be available and used');
            assert.equal(tickets[0].blocked, false, 'Ticket should not be blocked');
            assert.equal(tickets[0].used, true, 'Ticket should be used');
            assert.equal(sections[0].num_tickets, 4, 'Available tickets should be the same');
            assert.equal(sections[0].sold, 1, 'Sold tickets should be the same');
        }
    });
});
