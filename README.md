# 🕹️ Teen Trivia Ultimate Arcade

  ![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white) ![Tecnologias](https://img.shields.io/badge/Tecnologias-Stack-blue?style=for-the-badge)

O **Teen Trivia Ultimate Arcade** é uma aplicação web interativa projetada para dinamizar dinâmicas de grupo, treinamentos e salas de aula. O sistema funciona como um painel de quiz competitivo no estilo arcade, permitindo que um moderador gerencie perguntas e elimine participantes em tempo real com base no desempenho das equipes.

---

## 🚀 Funcionalidades Principais

- **👾 Painel do Moderador:** Interface embutida (Modal) para configurar e gerenciar as regras da partida antes e durante o jogo.
- **👥 Gestão Dinâmica de Equipes:** Suporte para múltiplos grupos customizáveis com a adição em tempo real de novos integrantes.
- **📸 Avatares Customizados:** Geração automática de avatares coloridos inspirados em jogos retrô baseados na inicial do nome, com suporte para upload de fotos reais do participante através do sistema de arquivos (`base64`).
- **💾 Persistência com LocalStorage:** Todo o estado do jogo (índice da pergunta atual, modificações de times, avatares e novas perguntas inseridas) é salvo automaticamente no navegador. A partida não se perde ao atualizar a página.
- **🎯 Sistema de Eliminação:** Mecânica visual de clique onde o moderador pode alternar o status do jogador (ativo/eliminado) aplicando efeitos visuais e controle de fim de jogo.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi construído de forma pura, focando em conceitos sólidos de manipulação nativa da Web:

- **HTML5:** Estruturação semântica das telas de jogo, modais de configuração e contêineres de dados.
- **CSS3:** Estilização com design moderno estilo arcade, uso de variáveis de cores, estados dinâmicos (classes `.hidden` e `.disabled`) e um sistema flexível de Grid e Flexbox para responsividade.
- **JavaScript Vanilla (ES6):**
  - Manipulação avançada e injeção dinâmica do DOM.
  - Leitura e conversão de arquivos de imagem locais usando a API `FileReader`.
  - Controle de estado e persistência local com a API de `localStorage`.
  - Lógica de ordenação de paleta de cores automática utilizando conversão de *Character Code*.

---

## 📂 Estrutura do Projeto

Para rodar o repositório configurado no GitHub Pages com a pasta pública, certifique-se de manter os arquivos estruturados da seguinte forma dentro do diretório `/docs`:

```text
docs/
├── img/
│   └── favicon.png
├── styles/
│   └── style.css
├── js/
│   └── script.js
└── index.html
```

---

## 🎮 Como Jogar Localmente

1. Clone este repositório em sua máquina:
   ```bash
   git clone https://github.com/leo-gomes-dev/game-desenvolvimento-equipe.git
   ```
2. Navegue até a pasta do projeto.
3. Abra o arquivo `index.html` diretamente em qualquer navegador moderno ou utilize extensões como o *Live Server* no VS Code.
4. Clique em **"Configurar Painel"** para cadastrar as perguntas personalizadas e o nome dos seus times.

---

## 🧠 Conceitos Práticos Aplicados

Este projeto serve como um excelente portfólio para demonstrar habilidades em:
1. Sincronização entre estados em memória no JavaScript e o armazenamento físico do `localStorage`.
2. Controle de fluxos de eventos assíncronos de input de arquivos (imagens).
3. Gerenciamento de classes utilitárias CSS para alternar telas em aplicações de página única (SPA) sem a necessidade de frameworks robustos.
