# ⛰️ Montanha | Taverna e Burger 🍔
> **O Próximo Nível da Experiência Gastronômica Digital.** Um portal imersivo em 3D, combinando Scrollytelling, WebGL de alta performance e engenharia de software de ponta para a marca *Montanha Taverna e Burger*.

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)]()
[![Three.js](https://img.shields.io/badge/Three.js-r185-black?logo=three.js)]()
[![GSAP](https://img.shields.io/badge/GSAP-Animation-green?logo=greensock)]()
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?logo=vite)]()

Este não é apenas um site institucional; é um ecossistema interativo de alto impacto visual. Projetado para romper com a mesmice do web design tradicional, o projeto utiliza técnicas avançadas de **Scrollytelling 3D** para guiar o usuário em uma jornada cinemática. Conforme a página é rotacionada, as montanhas escarpadas revelam a história, a mística e o produto da marca, transformando a navegação comum em uma experiência memorável de conversão de clientes.

---

## 💎 A Visão de Web Design Moderno
Interfaces estáticas falharam em reter a atenção do usuário moderno. Este projeto foi concebido sob três pilares de vanguarda:

1. **Imersão Sensorial Sem Atrito:** O usuário não consome informação clicando em menus tediosos; ele descobre o universo da marca de forma orgânica através do movimento de scroll.
2. **Casamento de Mídias (HTML + WebGL):** Uma engenharia sofisticada de profundidade (z-index) permite que textos semânticos e otimizados para SEO flutuem perfeitamente sobre um universo tridimensional renderizado em tempo real.
3. **Estética Temática Consistente:** O cenário medieval em *low-poly* evoca o espírito de guilda, aventura e fogo — valores que se conectam diretamente com a experiência de hambúrgueres artesanais assados na brasa da *Montanha Taverna*.

---

## 🛠️ Arquitetura e Engenharia de Software
Para suportar uma interface com renderização 3D em tempo real mantendo a fluidez de 60 FPS, a stack de tecnologia foi rigidamente selecionada e estruturada:

### 🔹 Core do Sistema
* **React 19 & React Compiler:** Renderização declarativa e componentização inteligente. O novo *compiler* gerencia automaticamente a reatividade, eliminando gargalos de re-renderização desnecessários de forma nativa.
* **Three.js & React Three Fiber (R3F):** Engine matemática para manipulação de malhas 3D, matrizes de rotação e iluminação em tempo real via WebGL.
* **@react-three/drei:** Utilização de ferramentas avançadas como `Environment` (mapeamento de iluminação baseada em imagem - IBL com o preset *sunset*) e controle paramétrico da câmera.
* **GSAP & ScrollTrigger:** O estado da timeline de animação está amarrado diretamente ao progresso do scroll do navegador através de interpolação matemática suave (`scrub`), permitindo transições fluidas e precisas da câmera.

### 🔹 Otimização e Performance (Tech Trade-offs)
* **Assets Binários Compactados:** O modelo original foi tratado e convertido para o formato `.glb` (GL Transmition Format binário), reduzindo drasticamente o tempo de requisição de rede e unificando malhas e geometrias.
* **Engine de Pipeline Pública:** Armazenamento estratégico dos modelos estáticos pesados na pasta `/public`, ignorando o overhead de processamento do bundler e garantindo cache agressivo pelo navegador.
* **Oxlint (Rust Tooling):** Utilização de analisadores estáticos de última geração escritos em Rust, garantindo um código livre de vazamentos de memória (memory leaks) e em total conformidade com as melhores práticas globais de JavaScript.

---

## 📂 Estrutura de Pastas Monolítica Cleancode
```text
📂 montanha-burguer
├── 📂 public/
│   └── 📂 modelos/          ← Modelos 3D proprietários e compactados (.glb)
└── 📂 src/
    ├── 📂 components/       ← Componentização atômica isolando a lógica 3D (Câmeras, Luzes, Canvas)
    ├── 📂 assets/           ← Recursos visuais estáticos e vetoriais
    ├── 📄 App.jsx           ← O Core da aplicação (Orquestrador de camadas)
    ├── 📄 App.css           ← Engenharia de Viewport (Camadas de profundidade e Absolute Inset layout)
    └── 📄 main.jsx          ← Ponto de entrada do ecossistema React
