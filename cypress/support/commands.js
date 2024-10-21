// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     addQuote(text: string, writer: string, year?: string): Chainable<void>;
//   }
// }
// Cypress.Commands.add('addQuote', (text: string, writer: string, year?: string) => {
//   cy.get('textarea[name="text"]').type(text);
//   cy.get('input[name="writer"]').type(writer);
//   if (year) {
//     cy.get('input[name="year"]').type(year);
//   }
//   cy.get('button[type="submit"]').click();
// });
