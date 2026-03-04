class ContestoModulator {
    constructor() {
        this.modulazioni = {
            formale: {
                'Stress Cognitivo': 1.3,
                'Ansia Sociale': 1.2,
                'Dominanza Naturale': 1.2,
                'Cooperazione': 1.1,
                'default': 1.0
            },
            informale: {
                'Interesse Autentico': 1.3,
                'Cooperazione': 1.2,
                'Ansia Sociale': 0.8,
                'default': 1.0
            },
            negoziale: {
                'Stress Cognitivo': 1.2,
                'Dominanza Naturale': 1.3,
                'Cooperazione': 1.2,
                'default': 1.0
            },
            conflittuale: {
                'Stress Cognitivo': 1.3,
                'Ansia Sociale': 1.2,
                'Cooperazione': 0.5,
                'default': 1.0
            },
            intimo: {
                'Interesse Autentico': 1.4,
                'Ansia Sociale': 1.3,
                'Stress Cognitivo': 0.7,
                'default': 1.0
            }
        };
    }

    applica(patternMatch, contesto) {
        if (!patternMatch || patternMatch.length === 0) return patternMatch;
        
        const mods = this.modulazioni[contesto] || this.modulazioni.formale;
        
        return patternMatch.map(p => ({
            ...p,
            score_originale: p.score,
            score: Math.min(100, Math.round(p.score * (mods[p.pattern] || mods.default)))
        })).sort((a, b) => b.score - a.score);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContestoModulator;
}
