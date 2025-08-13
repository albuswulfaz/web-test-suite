const { test, expect } = require('@playwright/test');
const fs = require('fs');

let dados;

test.beforeAll(async () => {
  // Carregar fixture
  dados = JSON.parse(fs.readFileSync('fixtures/busca_pacto.json', 'utf-8'));
});

test.describe('Busca no Yahoo com validações OWASP', () => {

  test('Busca simples e validação de resultados', async ({ page }) => {
    await page.goto(dados.baseUrl);

    // Digitar termo de busca
    const searchInput = page.locator('input[name="p"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill(dados.termoBusca);
    await searchInput.press('Enter');

    // Validar que o termo aparece no campo de busca
    await expect(searchInput).toHaveValue(dados.termoBusca);

    // Validar que há resultados
    const results = page.locator('#web ol li');
    await expect(results).toHaveCountGreaterThan(0);

    // Verificar o conteúdo do primeiro resultado
    const firstResultText = await results.first().innerText();
    expect(firstResultText.toLowerCase()).toContain('pacto');
    expect(firstResultText.toLowerCase()).toContain('soluções');

    // Checar status HTTP
    const response = await page.request.get(dados.baseUrl);
    expect(response.status()).toBe(200);
  });

  test('Teste de segurança – XSS (OWASP A03)', async ({ page }) => {
    await page.goto(dados.baseUrl);
    const searchInput = page.locator('input[name="p"]');
    await searchInput.fill(dados.payloadXSS);
    await searchInput.press('Enter');

    const body = page.locator('body');
    const bodyHTML = await body.innerHTML();
    expect(bodyHTML).not.toContain('<script>alert(1)</script>');
  });

  test('Verificar exposição de dados sensíveis (OWASP A02)', async ({ page }) => {
    await page.goto(dados.baseUrl);
    const searchInput = page.locator('input[name="p"]');
    await searchInput.fill(dados.termoBusca);
    await searchInput.press('Enter');

    const results = page.locator('#web ol li');
    const count = await results.count();
    for (let i = 0; i < count; i++) {
      const text = await results.nth(i).innerText();
      expect(text).not.toMatch(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/); // CPF
      expect(text).not.toMatch(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i); // Email
    }
  });

  test('Verificar cabeçalhos de segurança (OWASP A05)', async ({ request }) => {
    const response = await request.get(dados.baseUrl);

    expect(response.headers()).toHaveProperty('content-security-policy');
    expect(response.headers()).toHaveProperty('x-frame-options');
    expect(response.headers()).toHaveProperty('strict-transport-security');
  });

});
