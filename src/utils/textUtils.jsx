import React from 'react';

export function splitIntoWords(content, wordClassName = 'word') {
if (!content) return null;

// 1. MOBILE: Retorna conteúdo puro sem repartir
if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return content;
}

// Garante que wordClassName nunca seja string vazia ou undefined
const finalClass = wordClassName || 'word';

const processString = (str, keyPrefix = '') => {
    return str.split(/\s+/).map((word, wIdx) => {
    if (!word) return null;
    return (
        <React.Fragment key={`${keyPrefix}-${wIdx}`}>
        <span className={finalClass}>{word}</span>
        {' '}
        </React.Fragment>
    );
    });
};

// CASO A: String simples
if (typeof content === 'string') {
    return processString(content, 'str');
}

// CASO B: Array com JSX / Destaques
if (Array.isArray(content)) {
    return content.map((item, index) => {
    if (typeof item === 'string') {
        return processString(item, `arr-${index}`);
    }

    if (React.isValidElement(item)) {
        const innerText = item.props.children;

        if (typeof innerText === 'string') {
        return innerText.split(/\s+/).map((word, wIdx) => {
            if (!word) return null;
            return (
            <React.Fragment key={`jsx-${index}-${wIdx}`}>
                {React.cloneElement(item, {
                className: `${item.props.className || ''} ${finalClass}`.trim(),
                children: word,
                })}
                {' '}
            </React.Fragment>
            );
        });
        }

        return (
        <React.Fragment key={`jsx-${index}`}>
            {React.cloneElement(item, {
            className: `${item.props.className || ''} ${finalClass}`.trim(),
            })}
            {' '}
        </React.Fragment>
        );
    }

    return item;
    });
}

return content;
}