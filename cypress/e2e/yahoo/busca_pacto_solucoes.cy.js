describe('Busca no Yahoo', () => {
    beforeEach(() => {
      cy.fixture('busca_pacto').as('dados');
    });
  
    it('Deve buscar termo e validar resultados', function () {
      cy.buscarNoYahoo(this.dados.termoBusca);
  
      // Validar que o termo aparece no campo de busca
      cy.get('input[name="p"]').should('have.value', this.dados.termoBusca);
  
      // Validar que há resultados
      cy.get('#web ol li')
        .should('exist')
        .and('have.length.greaterThan', 0);
  
      // Verificar se o primeiro resultado contém as palavras
      cy.get('#web ol li').first().invoke('text').should(text => {
        expect(text.toLowerCase()).to.include('pacto');
        expect(text.toLowerCase()).to.include('soluções');
      });
  
      // Checar que a página carregou sem erros HTTP
      cy.request('https://br.yahoo.com/')
        .its('status')
        .should('eq', 200);
    });
  });
  