var dataBase = require('./db.js');

module.exports = class Model {
    constructor(table) {
        this.table = table;
    }

    async find (value, byWhat) {
        const db = dataBase.connectDB();
        let selectQuery = `SELECT * FROM ${this.table} WHERE ${byWhat} = ${value}`;
        const res = await db.promise().query(selectQuery);
        db.end();
        if (!res[0].length) {
            return false;
        }
        else {
            return res[0];
        }
    }

    async delete (id) {
        if (this.find(id).length == 0) {
            return false;
        }

        const db = dataBase.connectDB();
        let deleteQuery = `DELETE from ${this.table} where id = ${id}`;
        const res = await db.promise().query(deleteQuery);
        db.end();

        return res[0];
    }
    
    async save (insertObject) {
        let keys = '';
        let values = '';
        let i = 0;
        let query;

        if (!insertObject.id) {
            for (const key in insertObject) {
                if (key == 'id') {
                    i++;
                    continue;
                }
                
                keys += key;
                values += '"' + insertObject[key] + '"';
    
                if (i != Object.keys(insertObject).length - 1) {
                    values += ", ";
                    keys += ", ";
                }
                i++;   
            }

            query =`INSERT INTO ${this.table} (${keys}) VALUES (${values});`;
        }
        else {
            for (const key in insertObject) {
                if (key == 'id') {
                    i++;
                    continue;
                }
                
                values += key + ' = "' + insertObject[key] + '"';
    
                if (i != Object.keys(insertObject).length - 1) {
                    values += ", ";
                }
                i++;

                query = `UPDATE ${this.table} SET ${values} WHERE id = ` + insertObject.id + ';';
            }
        }
        
        const db = dataBase.connectDB();
        const res = await db.promise().query(query);
        db.end();

        return res[0];
    }

    async getRaws (byWhat) {
        const db = dataBase.connectDB();
        let countQuery = `SELECT COUNT (${byWhat}) FROM ${this.table}`;
        const res = await db.promise().query(countQuery);
        db.end();
        return Object.values(res[0][0])[0];
    }
}
