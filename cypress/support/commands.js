Cypress.Commands.add('buscarNoYahoo', (termo) => {
    cy.visit(Cypress.env('baseUrl') || 'https://br.yahoo.com/');
    cy.get('input[name="p"]').should('be.visible').type(`${termo}{enter}`);
  });
  