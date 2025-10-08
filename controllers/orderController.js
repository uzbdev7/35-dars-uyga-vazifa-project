import pool from "./pool.js";

export const orderController = {
    get: async (req, res, next) => {
        try {
            let result = await pool.query(`SELECT * FROM orders;`);
            res.status(200).json(result.rows);
        } catch(err) {
            next(err);
        }
    },

    getOne: async (req, res, next) => {
        try {
            const { id } = req.params;
            let result = await pool.query(`SELECT * FROM orders WHERE id=$1;`, [id]);

            if(result.rows.length === 0){
                return res.status(404).json({ message: "Order topilmadi." });
            }

            res.status(200).json(result.rows[0]);
        } catch(err) {
            next(err);
        }
    },

    getModelById: async (req, res, next) => {
        try {
            const { customer_id } = req.params;
            const result = await pool.query(`SELECT * FROM orders WHERE customer_id = $1;`, [customer_id]);
            res.status(200).json(result.rows);
        } catch(err) {
            next(err);
        }
    },

    post: async (req, res, next) => {
        try {
            const { customer_id, total_price, order_date, order_status } = req.body;
            let result = await pool.query(
                `INSERT INTO orders(customer_id, total_price, order_date, order_status) VALUES ($1, $2, $3, $4) RETURNING *;`,
                [customer_id, total_price, order_date, order_status]
            );

            res.status(201).json({
                message: "Order muvafaqqiyatli yaratildi.",
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

            const orderCheck = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
            if (orderCheck.rows.length === 0) {
                return res.status(404).json({ message: "Order topilmadi." });
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
                `UPDATE orders SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`,
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
            const result = await pool.query(`DELETE FROM orders WHERE id=$1 RETURNING *`, [id]);

            if(result.rows.length === 0){
                return res.status(404).json({ message: "Order topilmadi." });
            }

            res.json({ message: "Order o'chirildi", deleted: result.rows[0] });
        } catch(err) {
            next(err);
        }
    }
}
