class IntensitaCalculator {
    calcola(deviazioni, congruenza, patternMatch, metadata) {
        const valori = Object.values(deviazioni).map(d => d.valore || 0);
        const media = valori.length ? valori.reduce((a, b) => a + b, 0) / valori.length : 0;
        const countAlti = valori.filter(v => v >= 2).length;
        
        const intensitaBase = (media / 3) * 50 + (countAlti / Math.max(1, valori.length)) * 50;
        const bonusPattern = (patternMatch[0]?.score || 0) * 0.3;
        
        const valore = Math.min(100, Math.round(intensitaBase + bonusPattern));
        
        let livello = 'tendenza';
        if (valore >= 80) livello = 'dominante';
        else if (valore >= 60) livello = 'forte';
        else if (valore >= 30) livello = 'attivo';
        
        return { valore, livello };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IntensitaCalculator;
}
