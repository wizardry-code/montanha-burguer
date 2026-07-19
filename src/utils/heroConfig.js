export const HERO_SCENES = [
  {
    id: "ponte",
    type: "simple",
    refKey: "ponte",
    enter: 1,
    exit: 4,
    // Passamos um array de tokens para o React renderizar nativamente
    tokens: [
      { text: "Atravesse a ponte entre o comum e o " },
      { text: "extraordinário", highlight: true },
      { text: ". Bem-vindo ao reino onde grandes aventuras despertam " },
      { text: "grandes fomes", highlight: true },
      { text: "." }
    ],
    layout: {
      desktop: { top: "auto", bottom: "18%", left: "50%", right: "auto", x: "-50%", y: "0%", align: "center" },
      mobile:  { top: "auto", bottom: "8%", left: "50%", right: "auto", x: "-50%", y: "0%", align: "center" }
    }
  },
  {
    id: "dragao",
    type: "simple",
    refKey: "dragao",
    enter: 6,
    exit: 11,
    tokens: [
      { text: "Cuidado! ", alert: true },
      { text: "Criaturas lendárias cobiçam nossas " },
      { text: "receitas secretas", highlight: true },
      { text: ". Mas aqui, até o " },
      { text: "fogo do dragão", highlight: true },
      { text: " trabalha para grelhar o burger perfeito." }
    ],
    layout: {
      desktop: { top: "auto", bottom: "25%", left: "auto", right: "10%", x: "0%", y: "-50%", align: "left" },
      mobile:  { top: "15%", bottom: "auto", left: "50%", right: "auto", x: "-50%", y: "0%", align: "center" }
    }
  },
  {
    id: "guilda",
    type: "simple",
    refKey: "guilda",
    enter: 18,
    exit: 22,
    tokens: [
      { text: "REÚNA SUA GALERA.", highlight: true },
      { text: " As campanhas mais gloriosas são feitas ao lado dos aliados mais próximos. E depois do combate, a " },
      { text: "taverna", highlight: true },
      { text: " aguarda para a festa." }
    ],
    layout: {
      desktop: { top: "50%", bottom: "auto", left: "50%", right: "auto", x: "-50%", y: "-50%", align: "center" },
      mobile:  { top: "50%", bottom: "auto", left: "50%", right: "auto", x: "-50%", y: "-50%", align: "center" }
    }
  },
  {
    id: "portao",
    type: "wrapper",
    refKey: "portao",
    enter: 23,
    exit: 25,
    tokensLeft: [
      { text: "O portal está aberto. Deixe o mundo virtual" }
    ],
    tokensRight: [
      { text: "e venha viver a " },
      { text: "experiência real", highlight: true },
      { text: " na nossa verdadeira " },
      { text: "fortaleza do sabor", highlight: true },
      { text: "!" }
    ],
    layout: {
      desktop: { top: "auto", bottom: "40%", left: "50%", right: "auto", x: "-50%", y: "0%", align: "center" },
      mobile:  { top: "50%", bottom: "auto", left: "50%", right: "auto", x: "-50%", y: "-50%", align: "center" }
    }
  }
];