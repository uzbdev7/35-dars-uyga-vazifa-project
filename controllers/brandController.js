import pool from "./pool.js";

export const brandController = {
    get : async (req, res, next) => {
        try {
            let result = await pool.query(`SELECT * FROM brand;`);
            res.status(200).json(result.rows);
        } catch(err) {
            next(err);
        }
    },

    getOne : async (req, res, next) => {
        try {
            const { id } = req.params;
            let result = await pool.query(`SELECT * FROM brand WHERE id=$1;`, [id]);
            if(result.rows.length === 0){
                return res.status(404).json({ message: "Brand topilmadi." });
            }
            res.status(200).json(result.rows[0]);
        } catch(err) {
            next(err);
        }
    },

    post : async (req, res, next) => {
        try {
            const { name } = req.body;
            let result = await pool.query(
                `INSERT INTO brand(name) VALUES ($1) RETURNING *;`, [name]
            );
            res.status(201).json({
                message:"Brand muvafaqqiyatli yaratildi.",
                data: result.rows[0]
            });
        } catch(err) {
            next(err);
        }
    },

    put : async (req, res, next) => {
        try {
            const { id } = req.params;
            const fields = [];
            const values = [];
            let idx = 1;

            const brandCheck = await pool.query("SELECT * FROM brand WHERE id = $1", [id]);
            if (brandCheck.rows.length === 0) {
                return res.status(404).json({ message: "Brand topilmadi." });
            }

            for(const [key, value] of Object.entries(req.body)){
                fields.push(`${key} = $${idx}`);
                values.push(value);
                idx++;
            }

            if(fields.length === 0){
                return res.status(400).json({ message:"O'zgarishlar mavjud emas." });
            }

            values.push(id);
            let result = await pool.query(
                `UPDATE brand SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`, 
                values
            );

            res.json({ message:"Muvafaqqiyatli yangilandi.", data: result.rows[0] });
        } catch(err) {
            next(err);
        }
    },

    deleteOne : async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await pool.query(`DELETE FROM brand WHERE id=$1 RETURNING *`, [id]);

            if(result.rows.length === 0) {
                return res.status(404).json({ message: "Brand topilmadi." });
            }

            res.json({ message: "Brand o'chirildi", deleted: result.rows[0] });
        } catch(err) {
            next(err);
        }
    }
}
