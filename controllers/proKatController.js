const {asyncQuery, generateQuery} = require('../helper/query')

module.exports = {
    getProKat : async(req,res) => {
        try {
            const query = `SELECT k.id, pk.produk_id, p.nama_produk, GROUP_CONCAT(k.kategori SEPARATOR '>') AS kategori FROM kategori k 
            JOIN pro_kat pk ON k.id = pk.kategori_id
            JOIN produk p ON pk.produk_id = p.id
            GROUP BY p.id;`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    getProKatByID : async(req,res) => {
        const id = parseInt(req.params.id)
        const checkId = `SELECT * FROM pro_kat WHERE produk_id=${id};`
        try {
            const result = await asyncQuery(checkId)
            if (result.length === 0) return res.status(500).send(`product with ${id} does not exist`)

            // display
            const query = `SELECT k.id, pk.produk_id, p.nama_produk, GROUP_CONCAT(k.kategori SEPARATOR '>') AS kategori FROM kategori k 
            JOIN pro_kat pk ON k.id = pk.kategori_id
            JOIN produk p ON pk.produk_id = p.id
            where p.id = ${id};`
            const show = await asyncQuery(query)
            res.status(200).send(show[0])
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    addProKat : async(req,res) => {
        const {id, category} = req.body
        try {
            // add
            const addCategory = `INSERT INTO pro_kat (produk_id, kategori_id) VALUES ('${id}', '${category}');`
            const addQuery = await asyncQuery(addCategory)
            console.log(addQuery)
            res.status(200).send(addQuery)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    deleteProKat : async(req,res) => {
        const id = parseInt(req.params.id)
        const checkId = `SELECT * FROM pro_kat WHERE produk_id=${id};`
        try {
            // check product exist
            const result = await asyncQuery(checkId)
            if (result.length === 0) return res.status(500).send(`product with ${id} does not exist`)

            const query = `DELETE FROM pro_kat WHERE produk_id = ${id}`
            const deleteQuery = await asyncQuery(query)
            console.log(deleteQuery)
            res.status(200).send(deleteQuery)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    editProKat : async(req,res) => {
        const id = parseInt(req.params.id)
        // pake id di tabel pro_kat
        const {category} = req.body
        const checkId = `SELECT * FROM pro_kat WHERE id=${id};`
        try {
            // check product exist
            const check = await asyncQuery(checkId)
            if (check.length === 0) return res.status(500).send(`product category with ${id} does not exist`)

            const edit = `UPDATE pro_kat SET ${generateQuery(req.body)} WHERE id = '${id}';`
            const result = await asyncQuery(edit)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}