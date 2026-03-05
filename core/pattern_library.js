/**
 * PATTERN LIBRARY - 50 Pattern Comportamentali
 */

const PATTERN_LIBRARY = [
    // === CLUSTER A - REGOLAZIONE EMOTIVA (10) ===
    { nome: "Stress Acuto", cluster: "A", segnali: ["S001", "S004", "S021", "S033"], direzione: "fuga" },
    { nome: "Negazione", cluster: "A", segnali: ["S012", "S017", "S026", "S040"], direzione: "fuga" },
    { nome: "Ansia Sociale", cluster: "A", segnali: ["S003", "S009", "S021", "S037", "S041"], direzione: "fuga" },
    { nome: "Over-control", cluster: "A", segnali: ["S001", "S013", "S016", "S031", "S034"], direzione: "controllo" },
    { nome: "Rabbia Repressa", cluster: "A", segnali: ["S013", "S029", "S036", "S046", "S048"], direzione: "controllo" },
    { nome: "Fragilità Emotiva", cluster: "A", segnali: ["S003", "S005", "S021", "S037"], direzione: "fuga" },
    { nome: "Resilienza", cluster: "A", segnali: ["S002", "S008", "S024", "S032", "S045"], direzione: "apertura" },
    { nome: "Panico", cluster: "A", segnali: ["S001", "S003", "S005", "S033", "S038"], direzione: "fuga" },
    { nome: "Vergogna", cluster: "A", segnali: ["S009", "S012", "S022", "S030", "S041"], direzione: "fuga" },
    { nome: "Disgusto", cluster: "A", segnali: ["S014", "S015", "S017", "S046"], direzione: "fuga" },

    // === CLUSTER B - INTENZIONE RELAZIONALE (10) ===
    { nome: "Interesse Autentico", cluster: "B", segnali: ["S002", "S006", "S020", "S024", "S045"], direzione: "apertura" },
    { nome: "Dipendenza Emotiva", cluster: "B", segnali: ["S011", "S012", "S023", "S029", "S049"], direzione: "dipendenza" },
    { nome: "Seduzione", cluster: "B", segnali: ["S011", "S020", "S024", "S032", "S047"], direzione: "approccio" },
    { nome: "Micro-ritiro", cluster: "B", segnali: ["S007", "S009", "S017", "S034", "S039"], direzione: "fuga" },
    { nome: "Distanziamento Emotivo", cluster: "B", segnali: ["S009", "S031", "S041", "S050", "S039"], direzione: "fuga" },
    { nome: "Attaccamento Ansioso", cluster: "B", segnali: ["S003", "S011", "S021", "S026", "S049"], direzione: "dipendenza" },
    { nome: "Attaccamento Evitante", cluster: "B", segnali: ["S007", "S009", "S022", "S034", "S050"], direzione: "fuga" },
    { nome: "Attaccamento Sicuro", cluster: "B", segnali: ["S002", "S006", "S008", "S024", "S045"], direzione: "apertura" },
    { nome: "Empatia", cluster: "B", segnali: ["S011", "S020", "S024", "S032", "S049"], direzione: "apertura" },
    { nome: "Freddezza", cluster: "B", segnali: ["S009", "S016", "S031", "S039", "S050"], direzione: "fuga" },

    // === CLUSTER C - GESTIONE DEL POTERE (10) ===
    { nome: "Dominanza Naturale", cluster: "C", segnali: ["S002", "S008", "S019", "S024", "S032"], direzione: "controllo" },
    { nome: "Dominanza Aggressiva", cluster: "C", segnali: ["S004", "S013", "S015", "S028", "S036"], direzione: "controllo" },
    { nome: "Leadership Naturale", cluster: "C", segnali: ["S002", "S008", "S019", "S024", "S045"], direzione: "controllo" },
    { nome: "Sottomissione", cluster: "C", segnali: ["S009", "S016", "S022", "S030", "S041"], direzione: "sottomissione" },
    { nome: "Intimidazione", cluster: "C", segnali: ["S004", "S015", "S019", "S029", "S036"], direzione: "controllo" },
    { nome: "Autoritarismo", cluster: "C", segnali: ["S013", "S015", "S028", "S029", "S043"], direzione: "controllo" },
    { nome: "Carisma", cluster: "C", segnali: ["S002", "S008", "S019", "S024", "S032"], direzione: "approccio" },
    { nome: "Sfida", cluster: "C", segnali: ["S004", "S010", "S013", "S028", "S036"], direzione: "controllo" },
    { nome: "Deferenza", cluster: "C", segnali: ["S009", "S011", "S022", "S030", "S034"], direzione: "sottomissione" },
    { nome: "Competizione", cluster: "C", segnali: ["S004", "S010", "S019", "S028", "S043"], direzione: "controllo" },

    // === CLUSTER D - INGANNO E MANIPOLAZIONE (10) ===
    { nome: "Inganno Strutturato", cluster: "D", segnali: ["S001", "S011", "S029", "S040", "S043"], direzione: "controllo" },
    { nome: "Autosabotaggio", cluster: "D", segnali: ["S004", "S014", "S021", "S027", "S048"], direzione: "fuga" },
    { nome: "Manipolazione Soft", cluster: "D", segnali: ["S011", "S024", "S029", "S047", "S049"], direzione: "controllo" },
    { nome: "Confusione Strategica", cluster: "D", segnali: ["S035", "S038", "S040", "S043", "S047"], direzione: "controllo" },
    { nome: "Gaslighting", cluster: "D", segnali: ["S014", "S040", "S043", "S046", "S048"], direzione: "controllo" },
    { nome: "Narcisismo", cluster: "D", segnali: ["S011", "S019", "S024", "S029", "S046"], direzione: "controllo" },
    { nome: "Vittimismo", cluster: "D", segnali: ["S005", "S009", "S021", "S041", "S046"], direzione: "vittima" },
    { nome: "Doppiezza", cluster: "D", segnali: ["S011", "S016", "S029", "S040", "S047"], direzione: "controllo" },
    { nome: "Sfruttamento", cluster: "D", segnali: ["S004", "S010", "S019", "S028", "S043"], direzione: "controllo" },
    { nome: "Dissimulazione", cluster: "D", segnali: ["S001", "S016", "S031", "S039", "S040"], direzione: "controllo" },

    // === CLUSTER E - COOPERAZIONE E CONFLITTO (10) ===
    { nome: "Cooperazione", cluster: "E", segnali: ["S006", "S008", "S020", "S024", "S049"], direzione: "apertura" },
    { nome: "Resistenza Passiva", cluster: "E", segnali: ["S009", "S016", "S017", "S021", "S041"], direzione: "fuga" },
    { nome: "Resistenza Attiva", cluster: "E", segnali: ["S004", "S015", "S019", "S028", "S043"], direzione: "controllo" },
    { nome: "Coping Attivo", cluster: "E", segnali: ["S002", "S008", "S013", "S020", "S045"], direzione: "approccio" },
    { nome: "Mediazione", cluster: "E", segnali: ["S002", "S006", "S008", "S020", "S049"], direzione: "apertura" },
    { nome: "Aggressività Passiva", cluster: "E", segnali: ["S009", "S016", "S021", "S027", "S048"], direzione: "indiretto" },
    { nome: "Conflitto Aperto", cluster: "E", segnali: ["S004", "S013", "S028", "S036", "S043"], direzione: "conflitto" },
    { nome: "Pacifismo", cluster: "E", segnali: ["S002", "S006", "S008", "S024", "S045"], direzione: "apertura" },
    { nome: "Ostilità", cluster: "E", segnali: ["S004", "S013", "S015", "S028", "S046"], direzione: "conflitto" },
    { nome: "Resistenza Verbale", cluster: "E", segnali: ["S028", "S041", "S042", "S043", "S048"], direzione: "fuga" }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PATTERN_LIBRARY;
}
