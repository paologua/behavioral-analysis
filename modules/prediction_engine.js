class PredictionEngine {
    predict(pattern, congruenza) {
        if (!pattern || pattern.length === 0) {
            return { direzione: 'indeterminata', probabilita: 0.3 };
        }

        const mainPattern = pattern[0];
        
        const mappaDirezioni = {
            'Stress Cognitivo': 'fuga',
            'Ansia Sociale': 'fuga',
            'Interesse Autentico': 'apertura',
            'Cooperazione': 'apertura',
            'Dominanza Naturale': 'controllo'
        };

        const direzione = mappaDirezioni[mainPattern.pattern] || 'indeterminata';
        const probabilitaBase = 0.6 + (mainPattern.score / 200);
        const probabilita = Math.min(0.95, probabilitaBase);

        return { direzione, probabilita };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PredictionEngine;
}
