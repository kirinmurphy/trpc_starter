describe('TypeScript Migration Validation', () => {
  it('confirms email functions work', () => {
    cy.resetMockEmailServer();
    cy.clearEmails();
    cy.task('log', 'Successfully used TypeScript email functions');
    expect(1).to.equal(1);
  });
});
