# Fantasy Unificado

Projeto React + Vite + TypeScript que unifica as páginas **Criar Liga** e **Escalar Time** em uma única aplicação,
com **menu único** (compartilhado via `Layout`) e rotas separadas:

- `/criar-liga`
- `/escalar-time`

## Como usar

1. **Instale as dependências**
   ```bash
   npm install
   ```

2. **Rode o projeto**
   ```bash
   npm run dev
   ```

3. **Acesse no navegador**
   - http://localhost:5173/criar-liga
   - http://localhost:5173/escalar-time

## Integrando seus componentes existentes

- Copie os componentes do projeto **Criar.txt** (antigo) para `src/pages/CriarLiga/components` e
  substitua o conteúdo de `CreateLeague.tsx` pelo seu componente real.
- Copie os componentes do projeto **Escalar.txt** (antigo) para `src/pages/EscalarTime/components` e
  substitua o conteúdo de `Escalar.tsx` pelo seu componente real.
- Se você usa uma biblioteca de UI (ex.: shadcn/ui), crie uma pasta `src/components/ui` e centralize
  os componentes compartilhados para uso nas duas páginas.

## Estrutura

```
src/
  components/
    Layout.tsx
    NavigationMenu.tsx
    ui/          # (opcional) componentes de UI compartilhados
  pages/
    CriarLiga/
      CreateLeague.tsx
      index.tsx
      components/    # (cole aqui seus componentes do projeto Criar.txt)
    EscalarTime/
      Escalar.tsx
      index.tsx
      components/    # (cole aqui seus componentes do projeto Escalar.txt)
  App.tsx
  main.tsx
  types/
    global.d.ts
```

Boa unificação! 🚀
