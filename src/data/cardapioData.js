import imagemUrl from '../assets/imgs/section2/imgS2A5.avif';

//Raridades
export const RARIDADES = {
COMUM: {
    id: "comum",
    label: "Comum",
    corGlow: "border-slate-400 shadow-slate-500/20",
    corTag: "bg-slate-800/80 text-slate-300 border-slate-600/40",
    cor: { glow: "rgba(148, 163, 184, 0.2)", border: "#94a3b8" }
},
RARO: {
    id: "raro",
    label: "Raro",
    corGlow: "border-cyan-400 shadow-cyan-500/30",
    corTag: "bg-cyan-950/80 text-cyan-300 border-cyan-500/40",
    cor: { glow: "rgba(34, 211, 238, 0.3)", border: "#22d3ee" }
},
EPICO: {
    id: "epico",
    label: "Épico",
    corGlow: "border-purple-500 shadow-purple-500/40",
    corTag: "bg-purple-950/80 text-purple-300 border-purple-500/40",
    cor: { glow: "rgba(168, 85, 247, 0.4)", border: "#a855f7" }
},
LENDARIO: {
    id: "lendario",
    label: "Lendário",
    corGlow: "border-amber-400 shadow-amber-500/50",
    corTag: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    cor: { glow: "rgba(251, 191, 36, 0.5)", border: "#fbbf24" }
}
};

// Helper pra buscar a raridade pelo id (ex: "epico") em vez de precisar saber a chave (EPICO)
export function getRaridadeById(id) {
return Object.values(RARIDADES).find((r) => r.id === id) || RARIDADES.COMUM;
}
// 1. CATEGORIAS MACRO (Apenas os 4 pilares de navegação)
export const CATEGORIAS = {
HAMBURGUER: { id: "hamburguer", label: "Hambúrgueres do Reino", icone: "🍔" },
PETISCO: { id: "petisco", label: "Entradas & Petiscos", icone: "🍟" },
SOBREMESA: { id: "sobremesa", label: "Alquimia Doce", icone: "🍨" },
BEBIDA: { id: "bebida", label: "Elixires & Bebidas", icone: "🥤" }
};
// 2. SUBCATEGORIAS (Tipos específicos de produto por categoria)
export const SUBCATEGORIAS = {
// --- Proteínas / Tipos para Hambúrguer e Petisco ---
BOVINO: { id: "bovino", label: "Carne Bovina", icone: "🥩" },
FRANGO: { id: "frango", label: "Frango", icone: "🍗" },
SUINO: { id: "suino", label: "Carne Suína", icone: "🥓" },
QUEIJO: { id: "queijo", label: "Base de Queijo", icone: "🧀" },
VEGANO: { id: "vegano", label: "Vegano", icone: "🌱", cor: "bg-emerald-950/80 text-emerald-300 border-emerald-500/40" },
VEGETARIANO: { id: "vegetariano", label: "Vegetariano", icone: "🧀", cor: "bg-lime-950/80 text-lime-300 border-lime-500/40" },
// --- Bebidas ---
ALCOOLICO: { id: "alcoolico", label: "Alcoólico", icone: "✅🍺", cor: "bg-purple-950/80 text-purple-300 border-purple-500/40" },
NAO_ALCOOLICA: { id: "nao-alcoolica", label: "Sem Álcool", icone: "🚫🍺", cor: "bg-sky-950/80 text-sky-300 border-sky-500/40" },
GASEIFICADO: { id: "gaseificado", label: "Gaseificado", icone: "🫧🥤", cor: "bg-blue-950/80 text-blue-300 border-blue-500/40" }
}
// 3. PROPRIEDADES & RESTRIÇÕES (Propriedades alimentares e físicas)
export const TIPOS_BEBIDAS_ALCOLICA = {
// --- Tipos de Bebidas ---
HIDROMEL: { id: "hidromel", label: "Hidromel", icone: "🥂🐝" },
CHOPP: { id: "chopp", label: "Chopp / Cerveja", icone: "🍺" },
VINHO: { id: "vinho", label: "Vinho", icone: "🍷" },
DRINK: { id: "drink", label: "Coquetel / Drink", icone: "🍹" },
REFRIGERANTE: { id: "refrigerante", label: "Refrigerante", icone: "🥤" },
SUCO: { id: "suco", label: "Suco Natural", icone: "🧃" },
AGUA: { id: "agua", label: "Água", icone: "💧" }
}
// 5. ALÉRGENOS & RESTRIÇÕES DE SAÚDE
export const RESTRICOES_ALIMENTARES = {
GLUTEN: { 
    id: "gluten", 
    label: "Contém Glúten", 
    icone: "🌾", 
    cor: "bg-amber-950/80 text-amber-300 border-amber-500/40" 
},
ZERO_ACUCAR: {
    id: "zero-acucar", label: "Zero Açúcar", icone: "🍃", cor: "bg-teal-950/80 text-teal-300 border-teal-500/40" 
},
LACTOSE: { 
    id: "lactose", 
    label: "Contém Lactose", 
    icone: "🥛", 
    cor: "bg-sky-950/80 text-sky-300 border-sky-500/40" 
},
CRUSTACEOS: { 
    id: "crustaceos", 
    label: "Contém Crustáceos / Frutos do Mar", 
    icone: "🦐", 
    cor: "bg-rose-950/80 text-rose-300 border-rose-500/40" 
},
AMENDOIM: { 
    id: "amendoim", 
    label: "Contém Amendoim / Oleaginosas", 
    icone: "🥜", 
    cor: "bg-orange-950/80 text-orange-300 border-orange-500/40" 
},
OVO: { 
    id: "ovo", 
    label: "Contém Ovo", 
    icone: "🥚", 
    cor: "bg-yellow-950/80 text-yellow-300 border-yellow-500/40" 
},
SOJA: { 
    id: "soja", 
    label: "Contém Soja", 
    icone: "🫘", 
    cor: "bg-stone-950/80 text-stone-300 border-stone-500/40" 
}
};
// 4. TAGS VARIADAS (Selos promocionais e de status RPG)
export const TAGS_VARIADAS = {
NOVIDADE: { id: "novidade", label: "Desbloqueado", icone: "🔓", cor: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
PREMIUM: { id: "premium", label: "Relíquia", icone: "💎", cor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" },
CHEFS_CHOICE: { id: "chefs-choice", label: "Favorito do Rei", icone: "👑", cor: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
PICANTE: { id: "picante", label: "Fogo Infernal", icone: "🔥", cor: "bg-red-500/20 text-red-400 border-red-500/30" }
};
// Opcional: Lista de Sabores de Hidromel para uso em dropdowns/modais
export const SABORES_HIDROMEL = {
wolfgard: [
    "Amora", "Baunilha", "Bouchet (mel caramelizado)", 
    "Bourbon (barris de bourbon whiskey)", "Carvalho Francês", 
    "Café Especial", "Dark Bouchet (chocolate belga 70%)", 
    "Framboesa", "Frutas Vermelhas", "Gran Goiaba", 
    "Hoppdrasil (maracujá e laranja)", "Irish Mead", 
    "Mirtilo", "Tawny (vinho do Porto)", "Rhodomel (pétalas de rosas)", 
    "Tradicional", "Viking Blood (cereja e carvalho)"
],
philipMead: [
    "Frutas Vermelhas", "Double Oak", "Oak Aged", 
    "Tradicional", "Abacaxi", "Vinho de Mel", "Cacau"
]
};
export const cardTcgData = [
// ============================================================================
// A. NOVIDADES DESBLOQUEADAS 
// ============================================================================
{
    id: "tesouro-dos-plebeus",
    nomeFicticio: "Tesouro dos Plebeus",
    nomeReal: "Porção de Bolinhos de Mandioca com Carne",
    preco: 34.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.RARO,
    categoria: CATEGORIAS.PETISCO,
    subcategoria: SUBCATEGORIAS.BOVINO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN],
    tags: [TAGS_VARIADAS.NOVIDADE],
    ingredientes: ["Bolinhas de mandioca crocantes", "Recheio de carne desfiada temperada"],
    descricaoRPG: "Uma porção reconfortante encontrada nas tavernas mais simples do reino.",
    status: [{ nome: "Fartura", valor: 750 }, { nome: "Sabor", valor: 820 }]
},
{
    id: "nuvens-do-cla-nil",
    nomeFicticio: "Nuvens do Clã Nil",
    nomeReal: "Porção de Travesseiros de Queijo Gouda",
    preco: 29.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.EPICO,
    categoria: CATEGORIAS.PETISCO,
    subcategoria: SUBCATEGORIAS.QUEIJO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.LACTOSE, RESTRICOES_ALIMENTARES.GLUTEN],
    tags: [TAGS_VARIADAS.NOVIDADE],
    ingredientes: ["Travesseirinhos empanados", "Queijo Gouda derretido"],
    descricaoRPG: "Pequenos e macios como as nuvens que rondam os picos do Clã Nil.",
    status: [{ nome: "Crocância", valor: 890 }, { nome: "Derretem", valor: 950 }]
},
{
    id: "espolio-do-cacador",
    nomeFicticio: "Espólio do Caçador",
    nomeReal: "Chorizo Angus com Acompanhamentos",
    preco: 75.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.LENDARIO,
    categoria: CATEGORIAS.PETISCO,
    subcategoria: SUBCATEGORIAS.BOVINO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN],
    tags: [TAGS_VARIADAS.NOVIDADE, TAGS_VARIADAS.CHEFS_CHOICE],
    ingredientes: ["Chorizo Angus", "Batatas rústicas da Taverna", "Vinagrete", "Farofa de bacon crocante", "Molho de alho"],
    descricaoRPG: "O prêmio supremo trazido direto das caçadas reais.",
    status: [{ nome: "Proteína", valor: 990 }, { nome: "Sabor", valor: 1000 }]
},
{
    id: "elixir-dos-guardioes",
    nomeFicticio: "Elixir dos Guardiões",
    nomeReal: "Drink de Hidromel, Maçã Verde e Hortelã",
    preco: 23.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.EPICO,
    categoria: CATEGORIAS.BEBIDA,
    subcategoria: SUBCATEGORIAS.ALCOOLICO,
    restricoesAlimentares: [],
    tags: [TAGS_VARIADAS.NOVIDADE],
    ingredientes: ["Hidromel da Casa", "Toque de Maçã Verde", "Folhas de Hortelã fresca"],
    descricaoRPG: "Drink revigorante usado para restaurar a estamina dos guardiões da torre.",
    status: [{ nome: "Refrescância", valor: 940 }, { nome: "Magia", valor: 850 }]
},
{
    id: "banquete-da-colheita",
    nomeFicticio: "Banquete da Colheita",
    nomeReal: "Hambúrguer Vegano de Grão de Bico",
    preco: 42.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.EPICO,
    categoria: CATEGORIAS.HAMBURGUER,
    subcategoria: SUBCATEGORIAS.VEGANO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN],
    tags: [TAGS_VARIADAS.NOVIDADE],
    ingredientes: ["Hambúrguer de Grão de Bico", "Alface", "Vinagrete", "Farofa crocante de bacon vegana", "Cheddar vegano"],
    descricaoRPG: "Invocado diretamente pelas bênçãos da mãe natureza.",
    status: [{ nome: "Vitalidade", valor: 880 }, { nome: "Sabor", valor: 900 }]
},

// ============================================================================
// B. ENTRADAS & PETISCOS
// ============================================================================
{
    id: "aneis-de-cebola-dourados",
    nomeFicticio: "Os Anéis de Cebola Dourados",
    nomeReal: "Anéis de Cebola Empanados Crocantes",
    preco: 27.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.RARO,
    categoria: CATEGORIAS.PETISCO,
    subcategoria: SUBCATEGORIAS.VEGETARIANO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN],
    tags: [],
    ingredientes: ["Anéis de cebola selecionados", "Empanado especial crocante"],
    descricaoRPG: "Garantem a energia necessária para os viajantes que passam pela Taverna do Reino de Montanha.",
    status: [{ nome: "Crocância", valor: 870 }, { nome: "Energia", valor: 790 }]
},
{
    id: "batata-rustica-do-ferreiro",
    nomeFicticio: "A Batata Rústica do Ferreiro",
    nomeReal: "Batata Rústica Frita com Casca e Páprica",
    preco: 27.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.RARO,
    categoria: CATEGORIAS.PETISCO,
    subcategoria: SUBCATEGORIAS.VEGANO,
    restricoesAlimentares: [],
    tags: [],
    ingredientes: ["Batata rústica com casca", "Tempero especial de páprica"],
    descricaoRPG: "As favoritas do ferreiro Hakon. Robustas, saborosas e o acompanhamento ideal para guerreiros.",
    status: [{ nome: "Robustez", valor: 850 }, { nome: "Tempero", valor: 820 }]
},
{
    id: "batata-frita-do-viajante",
    nomeFicticio: "A Batata Frita do Viajante",
    nomeReal: "Batata Frita Tradicional com Páprica",
    preco: 25.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.COMUM,
    categoria: CATEGORIAS.PETISCO,
    subcategoria: SUBCATEGORIAS.VEGANO,
    restricoesAlimentares: [],
    tags: [],
    ingredientes: ["Batata palito tradicional", "Toque de páprica"],
    descricaoRPG: "O fiel item de todo aventureiro, sendo simples e indispensável em sua jornada.",
    status: [{ nome: "Tradição", valor: 800 }, { nome: "Sabor", valor: 780 }]
},
{
    id: "esferas-empanadas-da-cidadela",
    nomeFicticio: "As Esferas Empanadas da Cidadela",
    nomeReal: "Porção de Frango Caseiro no Panko",
    preco: 28.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.RARO,
    categoria: CATEGORIAS.PETISCO,
    subcategoria: SUBCATEGORIAS.FRANGO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN],
    tags: [],
    ingredientes: ["Frango caseiro frito", "Empanado Panko crocante"],
    descricaoRPG: "Suprimento rápido e compacto para garantir a energia necessária para restaurar sua força vital.",
    status: [{ nome: "Crocância", valor: 910 }, { nome: "Força", valor: 840 }]
},

// ============================================================================
// C. HAMBÚRGUERES DO REINO
// ============================================================================
{
    id: "coracao-do-reino-de-montanha",
    nomeFicticio: "O Coração do Reino de Montanha",
    nomeReal: "Hambúrguer 180g no Pão Pretzel",
    preco: 49.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.LENDARIO,
    categoria: CATEGORIAS.HAMBURGUER,
    subcategoria: SUBCATEGORIAS.BOVINO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN, RESTRICOES_ALIMENTARES.LACTOSE],
    tags: [TAGS_VARIADAS.PREMIUM],
    ingredientes: ["Hambúrguer grelhado 180g", "Queijo do Reino", "Farofa de bacon", "Anéis de cebola", "Pão Pretzel", "Maionese defumada"],
    descricaoRPG: "Nobre, complexo e grandioso. Um tributo ao Rei de Montanha forjado pelo clã Akio.",
    status: [{ nome: "Sabor", valor: 980 }, { nome: "Massa", valor: 990 }]
},
{
    id: "escudo-de-zander",
    nomeFicticio: "O Escudo de Zander",
    nomeReal: "Hambúrguer 180g no Pão Brioche",
    preco: 46.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.RARO,
    categoria: CATEGORIAS.HAMBURGUER,
    subcategoria: SUBCATEGORIAS.BOVINO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN, RESTRICOES_ALIMENTARES.LACTOSE],
    tags: [],
    ingredientes: ["Hambúrguer grelhado 180g", "Queijo derretido", "Pão Brioche", "Maionese de alho"],
    descricaoRPG: "Simples, robusto e certeiro. O clássico favorito do lendário guerreiro fundador do clã Zander.",
    status: [{ nome: "Defesa", valor: 850 }, { nome: "Sabor", valor: 890 }]
},
{
    id: "legado-de-zion",
    nomeFicticio: "O Legado de Zion",
    nomeReal: "Hambúrguer 180g no Pão Australiano",
    preco: 48.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.EPICO,
    categoria: CATEGORIAS.HAMBURGUER,
    subcategoria: SUBCATEGORIAS.BOVINO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN, RESTRICOES_ALIMENTARES.LACTOSE],
    tags: [],
    ingredientes: ["Hambúrguer grelhado 180g", "Queijo", "Cebola roxa na manteiga", "Tomate na chapa", "Pão Australiano", "Barbecue com mel"],
    descricaoRPG: "Honrado, abundante e fundamental. A prova da dedicação inabalável do clã Zion.",
    status: [{ nome: "Dulcificação", valor: 910 }, { nome: "Sabor", valor: 940 }]
},
{
    id: "discipulo-de-kai",
    nomeFicticio: "O Discípulo de Kai",
    nomeReal: "Hambúrguer 180g com Vinagrete e Brioche",
    preco: 48.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.EPICO,
    categoria: CATEGORIAS.HAMBURGUER,
    subcategoria: SUBCATEGORIAS.BOVINO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN, RESTRICOES_ALIMENTARES.LACTOSE],
    tags: [],
    ingredientes: ["Hambúrguer grelhado 180g", "Queijo", "Farofa de bacon", "Vinagrete", "Pão Brioche", "Maionese de alho"],
    descricaoRPG: "Refrescante, vital e fluído. Celebra a provisão das águas e o sustento do clã Kai.",
    status: [{ nome: "Agilidade", valor: 890 }, { nome: "Frescor", valor: 920 }]
},
{
    id: "o-aventureiro",
    nomeFicticio: "O Aventureiro",
    nomeReal: "Hambúrguer de Frango Empanado no Panko 140g",
    preco: 46.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.RARO,
    categoria: CATEGORIAS.HAMBURGUER,
    subcategoria: SUBCATEGORIAS.FRANGO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN, RESTRICOES_ALIMENTARES.LACTOSE],
    tags: [],
    ingredientes: ["Frango empanado no Panko 140g", "Queijo", "Alface americana", "Tomate", "Pão Brioche", "Molho Mostarda e Mel"],
    descricaoRPG: "Crocante, essencial e surpreendente. É o favorito de um misterioso aventureiro.",
    status: [{ nome: "Crocância", valor: 930 }, { nome: "Precisão", valor: 860 }]
},
{
    id: "sentinela-dos-ceus",
    nomeFicticio: "O Sentinela dos Céus",
    nomeReal: "Hambúrguer de Frango Grelhado 180g",
    preco: 46.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.RARO,
    categoria: CATEGORIAS.HAMBURGUER,
    subcategoria: SUBCATEGORIAS.FRANGO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN, RESTRICOES_ALIMENTARES.LACTOSE],
    tags: [],
    ingredientes: ["Frango grelhado 180g", "Queijo", "Alface americana", "Tomate", "Pão Brioche", "Molho Mostarda e Mel"],
    descricaoRPG: "Leve, ágil e essencial. Representa a vigilância e a visão aguçada do clã Nil.",
    status: [{ nome: "Visão", valor: 900 }, { nome: "Leveza", valor: 880 }]
},

// ============================================================================
// D. SOBREMESAS (ALQUIMIA DOCE)
// ============================================================================
{
    id: "brownie-do-alquimista-alden",
    nomeFicticio: "O Brownie do Alquimista Alden",
    nomeReal: "Brownie Quente com Sorvete e Ganache",
    preco: 22.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.LENDARIO,
    categoria: CATEGORIAS.SOBREMESA,
    subcategoria: SUBCATEGORIAS.VEGETARIANO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN, RESTRICOES_ALIMENTARES.LACTOSE],
    tags: [TAGS_VARIADAS.CHEFS_CHOICE],
    ingredientes: ["Brownie aquecido", "Sorvete cremoso", "Ganache de chocolate artesanal"],
    descricaoRPG: "O favorito do alquimista Alden para restaurar mana e vitalidade para a próxima aventura.",
    status: [{ nome: "Mana", valor: 1000 }, { nome: "Doçura", valor: 970 }]
},
{
    id: "calice-de-gelo",
    nomeFicticio: "O Cálice de Gelo",
    nomeReal: "Taça de Sorvete com Cobertura de Ganache",
    preco: 16.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.RARO,
    categoria: CATEGORIAS.SOBREMESA,
    subcategoria: SUBCATEGORIAS.VEGETARIANO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.LACTOSE],
    tags: [],
    ingredientes: ["Taça de sorvete de baunilha", "Ganache de chocolate"],
    descricaoRPG: "O segredo para fortalecer a resistência e blindar o espírito contra os perigos da jornada.",
    status: [{ nome: "Resistência", valor: 840 }, { nome: "Gelo", valor: 890 }]
},

// ============================================================================
// E. BEBIDAS & HIDROMEL
// ============================================================================
{
    id: "dose-de-hidromel",
    nomeFicticio: "Dose de Hidromel da Taverna",
    nomeReal: "Dose Individual de Hidromel Artesanal",
    preco: 16.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.EPICO,
    categoria: CATEGORIAS.BEBIDA,
    subcategoria: SUBCATEGORIAS.ALCOOLICO,
    restricoesAlimentares: [],
    tags: [],
    ingredientes: ["Escolha 1 sabor das marcas Wolfgard ou Philip Mead"],
    descricaoRPG: "A lendária bebida dos deuses e guerreiros do norte.",
    status: [{ nome: "Teor", valor: 750 }, { nome: "Sabor", valor: 920 }]
},
{
    id: "rodada-hidromel-taverna",
    nomeFicticio: "A Rodada de Hidromel da Taverna",
    nomeReal: "Degustação com 3 Sabores de Hidromel",
    preco: 41.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.LENDARIO,
    categoria: CATEGORIAS.BEBIDA,
    subcategoria: SUBCATEGORIAS.ALCOOLICO,
    restricoesAlimentares: [],
    tags: [],
    ingredientes: ["Escolha 3 sabores à sua escolha para degustação"],
    descricaoRPG: "Perfeito para compartilhar histórias ao redor do fogo da taverna.",
    status: [{ nome: "Variedade", valor: 950 }, { nome: "Sabor", valor: 960 }]
},
{
    id: "garrafa-de-hidromel",
    nomeFicticio: "Garrafa de Hidromel do Reino",
    nomeReal: "Garrafa Fechada 750ml",
    preco: 139.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.LENDARIO,
    categoria: CATEGORIAS.BEBIDA,
    subcategoria: SUBCATEGORIAS.ALCOOLICO,
    restricoesAlimentares: [],
    tags: [],
    ingredientes: ["Garrafa completa à sua escolha (Wolfgard / Philip Mead)"],
    descricaoRPG: "Provisão para longas jornadas e grandes celebrações.",
    status: [{ nome: "Volume", valor: 1000 }, { nome: "Nobreza", valor: 1000 }]
},
{
    id: "chopp-da-taverna",
    nomeFicticio: "Caneca de Chopp do Valhalla",
    nomeReal: "Chopp Pilsen Tradição 500ml",
    preco: 14.90,
    imagemUrl: imagemUrl,
    raridade: RARIDADES.COMUM,
    categoria: CATEGORIAS.BEBIDA,
    subcategoria: SUBCATEGORIAS.ALCOOLICO,
    restricoesAlimentares: [RESTRICOES_ALIMENTARES.GLUTEN],
    tags: [],
    ingredientes: ["Chopp bem gelado servido na caneca da taverna"],
    descricaoRPG: "Sempre gelado e abundante para matar a sede de qualquer guerreiro.",
    status: [{ nome: "Refrescância", valor: 880 }, { nome: "Gole", valor: 850 }]
}
];