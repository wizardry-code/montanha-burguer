import styles from './TagItem.module.css';

export function TagItem({ icone, label, apenasIcone = false }) {
if (apenasIcone) {
    return (
    <span className={styles.tagIconOnly} title={label}>
        <span aria-hidden="true">{icone}</span>
        <span className={styles.srOnly}>{label}</span>
    </span>
    );
}

return (
    <span className={styles.tagFull}>
    <span aria-hidden="true">{icone}</span>
    <span>{label}</span>
    </span>
);
}