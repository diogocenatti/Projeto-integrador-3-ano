# Portugal | Entre Lendas e Patrimônios

Migração técnica do projeto original para uma estrutura React + React Native, mantendo a estrutura de conteúdo, imagens e modelos 3D do legado.

## Estrutura

```text
portugal-cultural-migration/
├── apps/
│   ├── web/
│   │   ├── public/
│   │   ├── src/
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.js
│   └── mobile/
│       ├── App.js
│       ├── app.json
│       ├── babel.config.js
│       └── package.json
├── packages/
│   └── shared/
│       └── src/
│           └── index.js
├── package.json
└── README.md
```

## Scripts

```bash
npm run web
npm run web:build
npm run mobile
npm run mobile:android
npm run mobile:ios
```

## Dependências principais

### Web
- react
- react-dom
- vite
- @vitejs/plugin-react
- three
- @google/model-viewer

### Mobile
- expo
- react
- react-native
- react-native-webview
- react-native-safe-area-context

## Observações

- O conteúdo original foi preservado em `packages/shared/src/index.js`.
- As imagens do projeto legado foram copiados para `apps/web/public/img`.
- Os modelos 3D originais foram copiados para as pastas públicas do app web, mantendo a lógica dos links do projeto original.
- A app mobile usa a mesma base de dados e abre os visualizadores em WebView, mantendo compatibilidade com a estrutura de modelos 3D.
