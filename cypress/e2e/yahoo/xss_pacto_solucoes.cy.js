describe('Teste de segurança no Yahoo', () => {
    beforeEach(() => {
      cy.fixture('busca_pacto').as('dados');
    });
  
    it('Não deve interpretar código malicioso', function () {
      cy.buscarNoYahoo(this.dados.payloadXSS);
  
      // Validar que o código não foi interpretado no front-end
      cy.get('body').should('not.contain.html', '<script>alert(1)</script>');
    });
  });
  