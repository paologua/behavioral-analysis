// Baseline Engine - Versione base
class BaselineEngine {
    constructor() {
        this.baseline = { nv: {}, pv: {}, v: {} };
    }
    
    costruisciBaseline(osservazioni) {
        console.log('Baseline costruita');
        return this.baseline;
    }
}

module.exports = BaselineEngine;
