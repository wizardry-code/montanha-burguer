import { useState } from 'react';
import { TagItem } from '../TagItem/TagItem';
import frameLunar from '../../assets/cardframes/frameCardLunar.svg';
import styles from './TcgMenuCard.module.css';
import { getRaridadeById } from '../../data/cardapioData';

export function TcgMenuCard({
nomeFicticio,
nomeReal,
preco,
imagemUrl,
raridade,        // string: "comum" | "raro" | "epico" | "lendario"
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

const raridadeInfo = getRaridadeById(raridade);
const cardStyle = {
    '--rarity-glow': raridadeInfo.cor.glow,
    '--rarity-border': raridadeInfo.cor.border,
};

const footerTags = [
    ...(categoria ? [categoria] : []),
    ...tags,
];

return (
    <article className={styles.card} style={cardStyle}>
    <button
        type="button"
        className={styles.imageButton}
        onClick={handleToggleFocus}
        aria-label={focusMode ? 'Mostrar informações do prato' : 'Ver foto em tela cheia'}>
        <img src={imagemUrl} alt={nomeReal} className={styles.image} />
    </button>

    {/* Moldura decorativa (frame SVG) — fica acima da imagem, abaixo do conteúdo */}
    <img
        src={frameLunar}
        alt=""
        aria-hidden="true"
        className={styles.frame}
    />

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