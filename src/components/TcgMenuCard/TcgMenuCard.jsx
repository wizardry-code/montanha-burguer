import { useState } from 'react';
import { TagItem } from '../TagItem/TagItem';
import styles from './TcgMenuCard.module.css';

// Mapa de cores por raridade — já que RARIDADES no data.js traz classes Tailwind
// (que não funcionam num projeto CSS puro), a cor real é resolvida aqui via raridade.id
const RARITY_COLORS = {
comum: { glow: 'rgba(148, 163, 184, 0.35)', border: 'rgba(148, 163, 184, 0.5)' },
raro: { glow: 'rgba(34, 211, 238, 0.4)', border: 'rgba(34, 211, 238, 0.55)' },
epico: { glow: 'rgba(168, 85, 247, 0.45)', border: 'rgba(168, 85, 247, 0.6)' },
lendario: { glow: 'rgba(251, 191, 36, 0.55)', border: 'rgba(251, 191, 36, 0.65)' },
};

export function TcgMenuCard({
nomeFicticio,
nomeReal,
preco,
imagemUrl,
raridade,
categoria,
subcategoria,
restricoesAlimentares = [],
tags = [],
ingredientes = [],
status = [],
}) {
const [focusMode, setFocusMode] = useState(false);

const precoFormatado = preco.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

function handleToggleFocus() {
    setFocusMode((prev) => !prev);
}

const rarityColor = RARITY_COLORS[raridade?.id] || RARITY_COLORS.comum;
const cardStyle = {
    '--rarity-glow': rarityColor.glow,
    '--rarity-border': rarityColor.border,
};

// Selos secundários do footer: categoria + tags promocionais, em formato ícone-only
const footerTags = [
    ...(categoria ? [categoria] : []),
    ...tags,
];

return (
    <article className={styles.card} style={cardStyle}>
    {/* Base / Moldura + Imagem Full-Art */}
    <button
        type="button"
        className={styles.imageButton}
        onClick={handleToggleFocus}
        aria-label={focusMode ? 'Mostrar informações do prato' : 'Ver foto em tela cheia'}
    >
        <img src={imagemUrl} alt={nomeReal} className={styles.image} />
    </button>

    {/* Header Superior Flutuante */}
    <div className={`${styles.header} ${focusMode ? styles.hidden : ''}`}>
        <div className={styles.headerLeft}>
        <span className={styles.nameBadge}>{nomeFicticio}</span>

        {(subcategoria || restricoesAlimentares.length > 0) && (
            <div className={styles.mainTagsRow}>
            {subcategoria && (
                <TagItem icone={subcategoria.icone} label={subcategoria.label} />
            )}

            {restricoesAlimentares.map((restricao) => (
                <TagItem
                key={restricao.id}
                icone={restricao.icone}
                label={restricao.label}
                />
            ))}
            </div>
        )}
        </div>

        <div className={styles.priceTag}>
        <span className={styles.priceValue}>R$ {precoFormatado}</span>
        <span className={styles.priceIcon} aria-hidden="true">💰</span>
        </div>
    </div>

    {/* Bloco Glassmorphism Inferior */}
    <div className={`${styles.footer} ${focusMode ? styles.hidden : ''}`}>
        <p className={styles.realName}>{nomeReal}</p>

        {/* Lista semântica de ingredientes — cada item nunca quebra no meio,
            mas a lista inteira quebra de linha quando o próximo item não couber */}
        <ul className={styles.ingredientsList}>
        {ingredientes.map((ingrediente, i) => (
            <li key={i} className={styles.ingredientTag}>
            {ingrediente}
            </li>
        ))}
        </ul>

        <div className={styles.statusRow}>
        {footerTags.length > 0 && (
            <div className={styles.secondaryTagsGroup}>
            {footerTags.map((tag) => (
                <TagItem
                key={tag.id}
                icone={tag.icone}
                label={tag.label}
                apenasIcone
                />
            ))}
            </div>
        )}

        {status.length > 0 && (
            <span className={styles.statusStats}>
            {status.map((s, i) => (
                <span key={s.nome}>
                {s.nome}: {s.valor}
                {i < status.length - 1 ? ' / ' : ''}
                </span>
            ))}
            </span>
        )}
        </div>
    </div>
    </article>
);
}