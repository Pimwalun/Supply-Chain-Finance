/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const {
    Contract,
    Context
} = require('fabric-contract-api');

// PaperNet specifc classes
const CommercialPaper = require('./paper.js');
const PaperList = require('./paperlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class CommercialPaperContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.paperList = new PaperList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class CommercialPaperContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.papernet.commercialpaper');
    }

    /**
     * Define a custom context for commercial paper
     */
    createContext() {
        return new CommercialPaperContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Issue purchase paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer company issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} issueDateTime paper issue date
     * @param {Integer} quantity face value of paper
     */
    async purchase(ctx, issuer, paperNumber, issueDateTime, quantity) {

        // create an instance of the paper
        let paper = CommercialPaper.createInstance(issuer, paperNumber, issueDateTime, quantity);

        // Smart contract, rather than paper, moves paper into PURCHASE state
        paper.setPurchase();

        // Newly issued paper is owned by the issuer
        paper.setOwner(issuer);

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.paperList.addPaper(paper);

        // Must return a serialized paper to caller of smart contract
        return paper.toBuffer();
    }

    /**
     * Purchasing product from supplier
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} currentOwner current owner of paper
     * @param {String} newOwner new owner of paper
     * @param {Integer} price price requested for this paper
     * @param {String} invoiceDateTime time paper was purchased (i.e. traded)
     */
    async invoice(ctx, issuer, paperNumber, currentOwner, newOwner, price, invoiceDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from PURCHASE to INVOICE
        if (paper.isPurchase()) {
            paper.setInvoice();
        }

        // Check paper is not already REQUEST
        if (paper.isInvoice()) {
            paper.setOwner(newOwner);
        } else {
            throw new Error('Paper ' + issuer + paperNumber + ' is not invoice. Current state = ' + cp.getCurrentState());
        }

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

    /**
     * request fund from funder
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} currentOwner current owner of paper
     * @param {String} newOwner new owner of paper
     * @param {Integer} amount price requested for this paper
     * @param {String} requestDateTime time paper was request (i.e. traded)
     */
    async request(ctx, issuer, paperNumber, currentOwner, newOwner, amount, requestDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from INVOICE to REQUEST
        if (paper.isInvoice()) {
            paper.setRequest();
        }

        // Check paper is not already STATEMENT
        if (paper.isRequest()) {
            paper.setOwner(newOwner);
        } else {
            throw new Error('Paper ' + issuer + paperNumber + ' is not request. Current state = ' + cp.getCurrentState());
        }

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

    /**
     * statement from funder to buyer
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} currentOwner current owner of paper
     * @param {String} newOwner new owner of paper
     * @param {String} statement price requested for this paper
     * @param {String} statementDateTime time paper was stated (i.e. traded)
     */
    async statement(ctx, issuer, paperNumber, currentOwner, newOwner, statement, statementDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from REQUEST to STATEMENT
        if (paper.isRequest()) {
            paper.setStatement();
        }

        // Check paper is not already CONFIRM
        if (paper.isStatement()) {
            paper.setOwner(newOwner);
        } else {
            throw new Error('Paper ' + issuer + paperNumber + ' is not statement. Current state = ' + cp.getCurrentState());
        }

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

    /**
     * confirm from buyer to funder
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} currentOwner current owner of paper
     * @param {String} newOwner new owner of paper
     * @param {String} confirm confirmation of this paper
     * @param {String} confirmDateTime time paper was confirm (i.e. traded)
     */
    async confirm(ctx, issuer, paperNumber, currentOwner, newOwner, confirm, confirmDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from STATEMENT to CONFIRM
        if (paper.isStatement()) {
            paper.setConfirm();
        }

        // Check paper is not already FUNDING
        if (paper.isConfirm()) {
            paper.setOwner(newOwner);
        } else {
            throw new Error('Paper ' + issuer + paperNumber + ' is not confirm. Current state = ' + cp.getCurrentState());
        }

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

    /**
     * funding from funder to supplier
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} currentOwner current owner of paper
     * @param {String} newOwner new owner of paper
     * @param {Integer} fund finding amount of this paper
     * @param {Integer} discount discount amount of this paper
     * @param {String} fundDateTime time paper was fund (i.e. traded)
     */
    async funding(ctx, issuer, paperNumber, currentOwner, newOwner, fund, discount, fundDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from CONFIRM to FUNDING
        if (paper.isConfirm()) {
            paper.setFunding();
        }

        // Check paper is not already STAUTS
        if (paper.isFunding()) {
            paper.setOwner(newOwner);
        } else {
            throw new Error('Paper ' + issuer + paperNumber + ' is not funding. Current state = ' + cp.getCurrentState());
        }

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

    /**
     * status sending from supplier to funder
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} currentOwner current owner of paper
     * @param {String} newOwner new owner of paper
     * @param {String} status status of this paper
     * @param {String} statusDateTime time paper was fund (i.e. traded)
     */
    async status(ctx, issuer, paperNumber, currentOwner, newOwner, status, statusDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from FUNDING to STATUS
        if (paper.isFunding()) {
            paper.setStatus();
        }

        // Check paper is not already COLLECT
        if (paper.isStatus()) {
            paper.setOwner(newOwner);
        } else {
            throw new Error('Paper ' + issuer + paperNumber + ' is not status. Current state = ' + cp.getCurrentState());
        }

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

    /**
     * collect sending from funder to buyer
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} currentOwner current owner of paper
     * @param {String} newOwner new owner of paper
     * @param {Integer} collect collect amount of this paper
     * @param {String} collectDateTime time paper was fund (i.e. traded)
     */
    async collect(ctx, issuer, paperNumber, currentOwner, newOwner, collect, collectDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Paper ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from STATUS to COLLECT
        if (paper.isStatus()) {
            paper.setCollect();
        }

        // Check paper is not already PAYMENT
        if (paper.isCollect()) {
            paper.setOwner(newOwner);
        } else {
            throw new Error('Paper ' + issuer + paperNumber + ' is not collect. Current state = ' + cp.getCurrentState());
        }

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

    /**
     * Payment commercial paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer 
     * @param {String} collectOwner redeeming owner of paper
     * @param {Integer} payment payment amount
     * @param {String} paymentDateTime time paper was redeemed
     */
    async payment(ctx, issuer, paperNumber, collectOwner, payment, paymentDateTime) {

        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);

        let paper = await ctx.paperList.getPaper(paperKey);

        // Check paper is not REDEEMED
        if (paper.isRedeemed()) {
            throw new Error('Paper ' + issuer + paperNumber + ' already redeemed');
        }

        // Verify that the redeemer owns the commercial paper before redeeming it
        if (paper.getOwner() === collectOwner) {
            paper.setOwner(paper.getIssuer());
            paper.setRedeemed();
        } else {
            throw new Error('Redeeming owner does not own paper' + issuer + paperNumber);
        }

        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }

}

module.exports = CommercialPaperContract;
