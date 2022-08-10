const Model = require('../model.js');

module.exports = class Hero extends Model {
    constructor (table) {
        super(table);
    }

    async find (value, byWhat){
        const res = await super.find(value, byWhat);
        if (!res) {
            return false;
        }
        this.name = res[0].name;
        this.healthpoints = res[0].healthpoints;
        this.damage = res[0].damage;
        this.rarity = res[0].rarity;
        this.image = res[0].image;
        return {
            name : this.name,
            healthpoints : this.healthpoints,
            damage : this.damage,
            rarity : this.rarity,
            image : this.image 
        };
    }

    async delete (id) {
        const res = await super.delete(id);
        if (!res) {
            return false;
        }
        else {
            this.name = undefined;
            this.healthpoints = undefined;
            this.damage = undefined;
            this.rarity = undefined;
            this.image = undefined;
            return res;
        }
    }

    async save (insertObject) {
        const res = await super.save(insertObject);
        return res;
    }

    async getRaws (byWhat) {
        const res = await super.getRaws(byWhat)
        return res;
    }
}
