import { useState } from 'react';
import styles from './TcgCardMenu.module.css';

export default function MenuCard({
nomeFicticio,
nomeReal,
preco,
imagemUrl,
raridade,
categoria,
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

// Cores de raridade vêm do próprio dado (item.raridade.corGlow / corBorda),
// aplicadas via CSS custom properties para não depender de classes fixas por raridade.
const cardStyle = {
    '--rarity-glow': raridade?.corGlow || 'rgba(255, 255, 255, 0.25)',
    '--rarity-border': raridade?.corBorda || 'rgba(255, 255, 255, 0.2)',
};

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
        <span className={styles.nameBadge}>{nomeFicticio}</span>

        <div className={styles.priceTag}>
        <span className={styles.priceValue}>R$ {precoFormatado}</span>
        <span className={styles.priceIcon} aria-hidden="true">💰</span>
        </div>
    </div>

    {/* Bloco Glassmorphism Inferior */}
    <div className={`${styles.footer} ${focusMode ? styles.hidden : ''}`}>
        <p className={styles.realName}>{nomeReal}</p>

        <ul className={styles.ingredientsList}>
        {ingredientes.map((ingrediente, i) => (
            <li key={i} className={styles.ingredientTag}>
            {ingrediente}
            </li>
        ))}
        </ul>

        <div className={styles.statusRow}>
        <div className={styles.tagsGroup}>
            {categoria && (
            <span className={styles.categoryTag}>
                {categoria.icone} {categoria.nome}
            </span>
            )}

            {tags.map((tag, i) => (
            <span
                key={i}
                className={styles.specialTag}
                style={{ '--tag-color': tag.corBadge || 'rgba(255, 255, 255, 0.15)' }}
            >
                {tag.icone} {tag.nome}
            </span>
            ))}
        </div>

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