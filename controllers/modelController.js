import pool from "./pool.js";

export const modelController = {
    get: async (req, res, next) => {
        try {
            let result = await pool.query(`SELECT * FROM model;`);
            res.status(200).json(result.rows);
        } catch(err) {
            next(err);
        }
    },

    getOne: async (req, res, next) => {
        try {
            const { id } = req.params;
            let result = await pool.query(`SELECT * FROM model WHERE id=$1;`, [id]);

            if(result.rows.length === 0){
                return res.status(404).json({ message: "Model topilmadi." });
            }

            res.status(200).json(result.rows[0]);
        } catch(err) {
            next(err);
        }
    },

    getModelById: async (req, res, next) => {
        try {
            const { brand_id } = req.params;
            const result = await pool.query(`SELECT * FROM model WHERE brand_id = $1;`, [brand_id]);
            res.status(200).json(result.rows);
        } catch(err) {
            next(err);
        }
    },

    post: async (req, res, next) => {
        try {
            const { name, brand_id } = req.body;
            let result = await pool.query(
                `INSERT INTO model(brand_id, name) VALUES ($1, $2) RETURNING *;`,
                [brand_id, name]
            );
            res.status(201).json({
                message: "Model muvafaqqiyatli yaratildi.",
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

            const modelCheck = await pool.query("SELECT * FROM model WHERE id = $1", [id]);
            if (modelCheck.rows.length === 0) {
                return res.status(404).json({ message: "Model topilmadi." });
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
                `UPDATE model SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`,
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
            const result = await pool.query(`DELETE FROM model WHERE id=$1 RETURNING *`, [id]);

            if(result.rows.length === 0){
                return res.status(404).json({ message: "Model topilmadi." });
            }

            res.json({ message: "Model o'chirildi", deleted: result.rows[0] });
        } catch(err) {
            next(err);
        }
    }
}
