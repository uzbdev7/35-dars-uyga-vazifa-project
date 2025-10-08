import pool from "./pool.js";

export const phoneController = {
    get: async (req, res, next) => {
        try {
            let result = await pool.query(`SELECT * FROM phone;`);
            res.status(200).json(result.rows);
        } catch(err) {
            next(err);
        }
    },

    getOne: async (req, res, next) => {
        try {
            const { id } = req.params;
            let result = await pool.query(`SELECT * FROM phone WHERE id=$1;`, [id]);

            if(result.rows.length === 0){
                return res.status(404).json({ message: "Telefon topilmadi." });
            }

            res.status(200).json(result.rows[0]);
        } catch(err) {
            next(err);
        }
    },

    getModelById: async (req, res, next) => {
        try {
            const { model_id } = req.params;
            const result = await pool.query(`SELECT * FROM phone WHERE model_id = $1;`, [model_id]);
            res.status(200).json(result.rows);
        } catch(err) {
            next(err);
        }
    },

    post: async (req, res, next) => {
        try {
            const { name, price, brand_id, model_id, color, display, ram, memory } = req.body;
            let result = await pool.query(
                `INSERT INTO phone(name, price, brand_id, model_id, color, display, ram, memory) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
                [name, price, brand_id, model_id, color, display, ram, memory]
            );

            res.status(201).json({
                message: "Telefon ma'lumotlari muvafaqqiyatli yaratildi.",
                data: result.rows[0]
            });

        } catch(err) {
            next(err);
        }
    },

    put: async (req, res, next) => {
        try {
            const { id } = req.params;
            const fields = [];
            const values = [];
            let idx = 1;

            const phoneCheck = await pool.query("SELECT * FROM phone WHERE id = $1", [id]);
            if (phoneCheck.rows.length === 0) {
                return res.status(404).json({ message: "Phone topilmadi." });
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
                `UPDATE phone SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`,
                values
            );

            res.json({ message:"Muvafaqqiyatli yangilandi.", data: result.rows[0] });
        } catch(err) {
            next(err);
        }
    },

    deleteOne: async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await pool.query(`DELETE FROM phone WHERE id=$1 RETURNING *`, [id]);

            if(result.rows.length === 0){
                return res.status(404).json({ message: "Telefon topilmadi." });
            }

            res.json({ message: "Telefon o'chirildi", deleted: result.rows[0] });
        } catch(err) {
            next(err);
        }
    }
}
