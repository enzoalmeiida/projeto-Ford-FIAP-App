# 📱 Projeto Ford FIAPApp

## a) Sobre o Projeto

**Nome do app:** FIAP Status & SRE Mobile

O projeto é um aplicativo móvel híbrido construído com Expo e Expo Router, pensado para apresentar um catálogo de carros, especificações, suporte e um mini‑store de peças. A estrutura segue rotas organizadas em (tabs) e (auth), com componentes reutilizáveis em components e tema centralizado em theme.ts. O objetivo funcional é oferecer uma experiência de navegação por abas, com destaque para uma home editorial, listagem rica de carros e uma tela de peças que atua como catálogo/loja leve.

Atualmente o app já incorpora melhorias visuais e de navegação (tema, tabs), autenticação persistida via AsyncStorage e uma lógica básica de carrinho; as mudanças mais recentes foram commitadas e enviadas para o repositório remoto. A versão web foi preparada para deploy em Vercel usando um processo de export estático (expo export:web) — veja o build script em package.json e a configuração de deploy em vercel.json.

---

## b) Integrantes do Grupo

* **Enzo Almeida Santos Ramos** - RM 556900
* **Gabriel de Mello Silva Fernandes** - RM 554421
* **Guilherme Machado Moreira** - RM 557290
* **Jose Antonio Kretzer Rodriguez** - RM 555523

---

## c) Como Rodar o Projeto

**Pré-requisitos:**

* [Node.js](https://nodejs.org/) instalado em sua máquina.
* Aplicativo **Expo Go** instalado no seu dispositivo móvel (Android ou iOS).

**Passo a passo para execução local:**

1. **Clone este repositório para a sua máquina:**
   ```bash
   git clone (https://github.com/Manerrando28/projeto-Ford-FIAP-App).git](https://github.com/Manerrando28/projeto-Ford-FIAP-App)
   ```
2. **Acesse o diretório do projeto:**
   ```bash
   cd fiap-mdi-cp2-sre-mobile
   ```
3. **Instale as dependências do projeto:**
   ```bash
   npm install
   ```
4. **Inicie o servidor do Expo:**
   ```bash
   npx expo start
   ```
5. **Abra o aplicativo Expo Go no seu celular e escaneie o QR Code exibido no terminal.**

---

## d) Demonstração

🎬 **Vídeo de Demonstração**
Assista ao fluxo completo, incluindo cadastro, login, validações e monitoramento:
[https://youtube.com/shorts/wypaT6iUx_g?si=kd5fPHnK0E-NtUxA](https://youtube.com/shorts/KUIZpyoEEWg)

### 📸 Telas do App

|                       Tela                       |                       Tela                       |                       Tela                       |
| :-----------------------------------------------: | :-----------------------------------------------: | :-----------------------------------------------: |
| ![Image 6](assets/images/IMG-20260524-WA0160.jpg) | ![Image 5](assets/images/IMG-20260524-WA0153.jpg) | ![Image 4](assets/images/IMG-20260524-WA0156.jpg) |
| ![Image 3](assets/images/IMG-20260524-WA0152.jpg) | ![Image 2](assets/images/IMG-20260524-WA0154.jpg) | ![Image 1](assets/images/IMG-20260524-WA0155.jpg) |
| ![Image 7](assets/images/IMG-20260524-WA0157.jpg) | ![Image 8](assets/images/IMG-20260524-WA0151.jpg) | ![Image 9](assets/images/IMG-20260524-WA0159.jpg) |

---

## e) Decisões Técnicas

Decisões Técnicas
Escolhemos Expo + React Native para acelerar desenvolvimento multiplataforma e usar expo-router para rotas declarativas; isso simplifica a organização em pastas como (tabs) e (auth) e mantém parity entre mobile e web. A arquitetura centraliza estilos e tokens em theme.ts e expõe pequenos hooks utilitários como use-responsive.ts para ajustar tipografia e imagens conforme viewport, além de um AuthContext em auth-context.tsx para controle de sessão persistida com @react-native-async-storage/async-storage.

---

## f) Diferenciais Implementados

Do ponto de vista de produto e UX, o app ganhou um layout mais profissional: tema refinado, ícones centralizados (icon-symbol.tsx) e uma home com blocos editoriais e métricas que funcionam de forma responsiva. As listas de carros foram enriquecidas com metadados reais centralizados em app/(tabs)/carrosData.ts/carrosData.ts), e as telas de detalhe (detalhes.tsx) foram preparadas para mostrar informações completas e compatibilidades.

No domínio funcional, implementei um fluxo de autenticação persistente em auth-context.tsx, e converti a aba de peças em um mini‑store com carrinho (lógica e UI em [app/(tabs)/pecas.tsx]) — isso inclui adicionar/remove itens, subtotal e visualização básica de estoque. Essas mudanças tornam o app útil como vitrine e protótipo de comércio leve, além de demonstrarem padrões reutilizáveis para futuras features.

---

## g) Próximos Passos

Imediatamente: acompanhar o deploy no Vercel, revisar os logs de build/preview para corrigir quaisquer incompatibilidades web (por exemplo loaders de imagem, caminhos de assets ou dependências nativas que precisam de fallback). Se algum pacote nativo causar erro no build, validar alternativas web‑compatíveis ou condicionar o uso por plataforma; cuidar também do hosting de imagens (otimizar e servir via CDN) para reduzir o tempo de build/deploy.

Médios e longos prazos: adicionar fluxo de checkout completo e persistência de pedidos para a loja; testes automatizados (unitários e E2E) e integração contínua; melhorias de performance e acessibilidade (Lighthouse), e documentação do projeto — atualizar README.md com instruções de desenvolvimento, build e deploy (incluindo o novo build em package.json e a vercel.json
