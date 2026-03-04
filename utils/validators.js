class Validators {
    static validaPeso(peso) {
        return peso >= 0 && peso <= 3;
    }
}
module.exports = Validators;
