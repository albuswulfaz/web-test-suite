---

# Testes Automatizados – Cypress & Playwright

Este repositório contém testes automatizados utilizando **Cypress** e **Playwright** para validar a busca no Yahoo e realizar verificações de segurança (OWASP Top 10).

---

## 📦 Pré-requisitos

* Node.js v22.18.0
* npm (geralmente já vem com Node.js)

---

## 🟢 Cypress

### 1. Instalação

```bash
# Inicializar projeto
npm init -y

# Instalar Cypress
npm install cypress --save-dev

# Instalar Cypress (binários)
npx cypress install
```

### 2. Execução

* **Modo gráfico:**

```bash
npx cypress open
```

* **Modo terminal (headless):**

```bash
npx cypress run --spec "cypress/e2e/yahoo/*"
```

### 3. Relatório de Testes Cypress

| Teste                         | Status   | Observações                                         |
| ----------------------------- | -------- | --------------------------------------------------- |
| Busca simples no Yahoo        | ✅ Passou | Funcionalidade principal está OK                    |
| XSS (OWASP A03)               | ❌ Falhou | Entradas como `<script>` não filtradas corretamente |
| Exposição de dados sensíveis  | ❌ Falhou | Possível falta de proteção de informações sensíveis |
| Cabeçalhos de segurança (A05) | ❌ Falhou | CSP, X-Frame-Options e HSTS ausentes                |

---

## 🟢 Playwright

### 1. Instalação

```bash
# Inicializar projeto
npm init -y

# Instalar Playwright Test
npm install -D @playwright/test

# Instalar navegadores
npx playwright install
```

### 2. Execução

* **Todos os testes (headless):**

```bash
npx playwright test
```

* **Modo com navegador aberto:**

```bash
npx playwright test --headed
```

### 3. Relatório de Testes Playwright

| Teste                                    | Status   | Observações                                                                           |
| ---------------------------------------- | -------- | ------------------------------------------------------------------------------------- |
| Busca simples no Yahoo                   | ❌ Falhou | Erro de assertion: `toHaveCountGreaterThan` não existe; ajustar validação de contagem |
| Exposição de dados sensíveis (OWASP A02) | ✅ Passou | Nenhum problema identificado                                                          |
| Cabeçalhos de segurança (OWASP A05)      | ❌ Falhou | CSP ausente; X-Frame-Options e HSTS presentes                                         |

**Observações:**

* Falhas relacionadas à **validação de contagem de elementos** e **verificação de CSP**.
* Sugestão: Ajustar assertions e revisar cabeçalhos esperados do Yahoo.

---

## 🔗 Testes Adicionais – UOL

### Termos de Segurança

1. [Normas de Segurança e Privacidade – UOL](https://sobreuol.noticias.uol.com.br/normas-de-seguranca-e-privacidade)

   * Última atualização: **21 de julho de 2021**

2. [Termos de Uso – UOL](https://noticias.uol.com.br/regras/termos-de-uso/)

   * Inclui termo de cooperação assinado com o **Ministério Público de São Paulo em novembro de 2005**

---

## ⚙️ Passos Recomendados

1. Corrigir assertions incorretas no Playwright (`toHaveCountGreaterThan`).
2. Ajustar testes de cabeçalhos de segurança conforme a resposta real dos sites.
3. Realizar novos testes de XSS utilizando entradas filtradas.
4. Manter relatórios atualizados com resultados de cada execução.

---
