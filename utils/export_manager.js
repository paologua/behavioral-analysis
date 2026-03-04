class ExportManager {
    esporta(dati, formato = 'json') {
        switch(formato) {
            case 'json':
                return JSON.stringify(dati, null, 2);
            case 'csv':
                return this.toCSV(dati);
            default:
                return JSON.stringify(dati);
        }
    }

    toCSV(dati) {
        if (!dati || !dati.pattern) return '';
        
        return `Timestamp,Pattern,Score,Intensità,Direzione\n${dati.timestamp},${dati.pattern.principale?.pattern},${dati.pattern.principale?.score},${dati.intensita?.valore},${dati.direzione}`;
    }

    download(data, filename, type = 'application/json') {
        const blob = new Blob([data], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ExportManager;
}
