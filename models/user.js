const Model = require('../model.js');

module.exports = class User extends Model {
    constructor (table) {
        super(table);
    }

    async find (value, byWhat){
        const res = await super.find(value, byWhat);
        if (!res) {
            return false;
        }
        this.id = res[0].id;
        this.login = res[0].login;
        this.password = res[0].password;
        this.fullName = res[0].fullName;
        this.email = res[0].email;
        this.status = res[0].status;
        return this;
    }

    async delete (id) {
        const res = await super.delete(id);
        if (!res) {
            return false;
        }
        else {
            this.id = undefined;
            this.name = undefined;
            this.race_id = undefined;
            this.description = undefined;
            this.class_role = undefined;
            return res;
        }
    }

    async save (insertObject) {
        const res = await super.save(insertObject);
        return res;
    }
}
