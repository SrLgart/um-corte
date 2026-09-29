# UM CORTE V8 — desenvolvimento e distribuição

V8 preservada, com documentação técnica baseada na implementação. Não houve redesign nem alteração de gameplay nesta etapa.

- **Comece por [docs/README.md](docs/README.md)**: índice, fontes da verdade e ordem de leitura.
- **Fontes de desenvolvimento:** `work/v8/`. Parte dos arquivos é gerada a partir de `work/v72/`; consulte [ARCHITECTURE](docs/ARCHITECTURE.md) antes de editar.
- **Distribuição:** [normal](build/um-corte-v8.html) e [ADMIN](build/um-corte-v8-admin.html). Cada arquivo é um HTML independente.
- **Referência original:** `archive/V8_FINAL_MONOLITHIC/`, com HTMLs, hashes e ZIP das fontes anteriores à organização.
- `outputs/` continua sendo a saída histórica usada pelo servidor e pelos testes existentes. Não é a fonte do jogo.

## Comandos

Requer Node.js. Build e testes de lógica usam apenas módulos nativos; não exigem `npm install`.

```powershell
node tools/build.cjs
node work/v8/test-all.cjs
node tools/verify-frozen.cjs
node tools/document-data.cjs
node tools/check-docs.cjs
```

`npm run build`, `npm test` e `npm run verify:frozen` são atalhos. O primeiro comando gera os dois HTMLs em `build/`. Abra o normal no navegador para jogar. Online depende de conectividade PeerJS/WebRTC; offline não requer backend.

O servidor legado serve **outputs/**, não build:

```powershell
node work/v8/build.cjs
node work/v8/serve.cjs
```

Acesse `http://127.0.0.1:4189/um-corte-v8.html`. Testes de navegador têm pré-requisitos separados em [TEST_CHECKLIST](docs/TEST_CHECKLIST.md).

Não há repositório Git nesta pasta. O checkpoint é uma cópia verificável, não um commit. Não reexecute migrations/refine scripts antigos indiscriminadamente. V8.5 não foi iniciada.
