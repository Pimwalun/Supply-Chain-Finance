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
     * @param {Integer} value face value of paper
     */
    async issue(ctx, issuer, paperNumber, issueDateTime, value) {

        // create an instance of the paper
        let paper = CommercialPaper.createInstance(issuer, paperNumber, issueDateTime, value);

        // Smart contract, rather than paper, moves paper into PURCHASE state
        paper.setIssued();

        // Newly issued paper is owned by the newOwner
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
     * @param {String} approvedDateTime time paper was purchased (i.e. traded)
     */
    async approve(ctx, issuer, paperNumber, currentOwner, approvedDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Letter of Credit ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from PURCHASE to INVOICE
        if (paper.isIssued()) {
            paper.setApproved();
        }else {
            throw new Error('Letter of Credit ' + issuer + paperNumber + ' is not approved. Current state = ' + cp.getCurrentState());
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
     * @param {String} confirmDateTime time paper was request (i.e. traded)
     */
    async confirm(ctx, issuer, paperNumber, currentOwner, confirmDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Letter of Credit ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from INVOICE to REQUEST
        if (paper.isApproved()) {
            paper.setConfirmed();
        }else {
            throw new Error('Letter of Credit ' + issuer + paperNumber + ' is not confirmed. Current state = ' + cp.getCurrentState());
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
     * @param {String} shippingDoc price requested for this paper
     * @param {String} statementDateTime time paper was added shipping (i.e. traded)
     */
    async addShipping(ctx, issuer, paperNumber, currentOwner, newOwner, shippingDoc, addShippingDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Letter of Credit ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from REQUEST to STATEMENT
        if (paper.isConfirmed()) {
            paper.setAddShipping();
        }

        // Check paper is not already CONFIRM
        if (paper.isAddShipping()) {
            paper.setOwner(newOwner);
        } else {
            throw new Error('Letter of Credit ' + issuer + paperNumber + ' is not added. Current state = ' + cp.getCurrentState());
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
     * @param {String} confirmedShippingDateTime time paper was confirm (i.e. traded)
     */
    async confirmedShipping(ctx, issuer, paperNumber, currentOwner, newOwner, confirmedShippingDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Letter of Credit ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from STATEMENT to CONFIRM
        if (paper.isAddShipping()) {
            paper.setConfirmedShipping();
        }

        // Check paper is not already FUNDING
        if (paper.isComfirmedShipping()) {
            paper.setOwner(newOwner);
        } else {
            throw new Error('Letter of Credit ' + issuer + paperNumber + ' is not confirmed. Current state = ' + cp.getCurrentState());
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
     * @param {Integer} price price paid for this paper
     * @param {String} paidDateTime time paper was paid (i.e. traded)
     */
    async paid(ctx, issuer, paperNumber, currentOwner, newOwner, price, paidDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getOwner() !== currentOwner) {
            throw new Error('Letter of Credit ' + issuer + paperNumber + ' is not owned by ' + currentOwner);
        }

        // First buy moves state from CONFIRM to FUNDING
        if (paper.isComfirmedShipping()) {
            paper.setPaidToAdvising();
        }
        if (paper.isPaidToAdvising()) {
            paper.setPaidToIssuing();
        }

        // Check paper is not already STAUTS
        if (paper.isPaidToAdvising() || paper.isPaidToIssuing()) {
            paper.setOwner(newOwner);
        } else {
            throw new Error('Letter of Credit ' + issuer + paperNumber + ' is not paid. Current state = ' + cp.getCurrentState());
        }

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper.toBuffer();
    }
}

module.exports = CommercialPaperContract;
