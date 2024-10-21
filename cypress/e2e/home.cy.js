describe('Quote Application', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('main').should('be.visible');
    });
    it('should load the home page', () => {
        cy.contains('Wilkommmen', { timeout: 10000 }).should('be.visible');
    });
});
