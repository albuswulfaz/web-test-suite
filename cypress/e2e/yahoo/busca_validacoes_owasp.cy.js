describe('Busca no Yahoo com validações OWASP', () => {

    beforeEach(() => {
      cy.fixture('busca_pacto').as('dados');
      Cypress.env('baseUrl', this?.dados?.baseUrl || 'https://br.yahoo.com/');
    });
  
    it('Deve buscar e validar resultados', function () {
      cy.buscarNoYahoo(this.dados.termoBusca);
  
      cy.get('input[name="p"]').should('have.value', this.dados.termoBusca);
      cy.get('#web ol li').should('exist').and('have.length.greaterThan', 0);
  
      cy.get('#web ol li').first().invoke('text').should(text => {
        expect(text.toLowerCase()).to.include('pacto');
        expect(text.toLowerCase()).to.include('soluções');
      });
  
      cy.request(this.dados.baseUrl).its('status').should('eq', 200);
    });
  
    it('Teste XSS (OWASP A03)', function () {
      cy.buscarNoYahoo(this.dados.payloadXSS);
      cy.get('body').should('not.contain.html', '<script>alert(1)</script>');
    });
  
    it('Exposição de dados sensíveis (OWASP A02)', function () {
      cy.buscarNoYahoo(this.dados.termoBusca);
      cy.get('#web ol li').each($el => {
        const text = $el.text();
        expect(text).not.to.match(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/); // CPF
        expect(text).not.to.match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i); // Email
      });
    });
  
    it('Configuração de segurança (OWASP A05)', function () {
      cy.request({
        url: this.dados.baseUrl,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.headers).to.have.property('content-security-policy');
        expect(response.headers).to.have.property('x-frame-options');
        expect(response.headers).to.have.property('strict-transport-security');
      });
    });
  
  });
  