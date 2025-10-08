import pool from "./pool.js";

export const customerController = {
    get: async (req, res, next) => {
        try {
            let result = await pool.query(`SELECT * FROM customer;`);
            res.status(200).json(result.rows);
        } catch(err) {
            next(err);
        }
    },

    getOne: async (req, res, next) => {
        try {
            const { id } = req.params;
            let result = await pool.query(`SELECT * FROM customer WHERE id=$1;`, [id]);

            if(result.rows.length === 0){
                return res.status(404).json({ message: "Mijoz topilmadi." });
            }

            res.status(200).json(result.rows[0]);
        } catch(err) {
            next(err);
        }
    },

    post: async (req, res, next) => {
        try {
            const { name, phone_number } = req.body;

            if(!name || !phone_number){
                return res.status(400).json({ message: "Hamma maydonlar to'la bo'lishi kerak." });
            }

            let result = await pool.query(
                `INSERT INTO customer(name, phone_number) VALUES ($1,$2) RETURNING *;`,
                [name, phone_number]
            );

            res.status(201).json({
                message: "Mijoz mal'lumotlari muvafaqqiyatli yaratildi.",
                data: result.rows[0]
            });

        } catch(err){
            next(err);
        }
    },

    put: async (req, res, next) => {
        try{
            const { id } = req.params;
            const fields = [];
            const values = [];
            let idx = 1;

            const Check = await pool.query("SELECT * FROM customer WHERE id = $1", [id]);
            if (Check.rows.length === 0) {
                return res.status(404).json({ message: "Mijoz topilmadi." });
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
                `UPDATE customer SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *;`,
                values
            );

            res.json({ message:"Muvafaqqiyatli yangilandi.", data: result.rows[0] });

        } catch(err){
            next(err);
        }
    },

    deleteOne: async (req, res, next) => {
        try{
            const { id } = req.params;
            const result = await pool.query(
                `DELETE FROM customer WHERE id=$1 RETURNING *`,
                [id]
            );

            if(result.rows.length === 0){
                return res.status(404).json({ message: "Mijoz ma'lumotlari topilmadi." });
            }

            res.json({ message: "Mijoz o'chirildi", deleted: result.rows[0] });

        } catch(err){ 
            next(err);
        }
    }
}
