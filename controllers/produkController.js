const { asyncQuery, generateQuery } = require('../helper/query')

module.exports = {
    // order / sort????
    getProducts: async (req, res) => {
        const query = req.query
        const queryKey = Object.keys(query)[0]
        const queryValue = Object.values(query)[0]
        console.log('query : ', query, queryKey, queryValue)
        try {
            if (queryKey === '_orderBy') {
                const getData = `SELECT p.id, p.nama_produk, p.deskripsi, p.harga, p.stok, GROUP_CONCAT(k.kategori SEPARATOR '>') AS kategori FROM kategori k 
                JOIN pro_kat pk ON k.id = pk.kategori_id
                JOIN produk p ON pk.produk_id = p.id
                GROUP BY p.id ORDER BY ${queryValue};`
                const result = await asyncQuery(getData)
                return res.status(200).send(result)
            }
            if(queryKey !== undefined) {
                const getData = `SELECT p.id, p.nama_produk, p.deskripsi, p.harga, p.stok, GROUP_CONCAT(k.kategori SEPARATOR '>') AS kategori FROM kategori k 
                JOIN pro_kat pk ON k.id = pk.kategori_id
                JOIN produk p ON pk.produk_id = p.id
                WHERE ${queryKey} = '${queryValue}'
                GROUP BY p.id;`
                const result = await asyncQuery(getData)
                return res.status(200).send(result)
            }
            const getData = `SELECT p.id, p.nama_produk, p.deskripsi, p.harga, p.stok, GROUP_CONCAT(k.kategori SEPARATOR '>') AS kategori FROM kategori k 
                JOIN pro_kat pk ON k.id = pk.kategori_id
                JOIN produk p ON pk.produk_id = p.id
                GROUP BY p.id;`
            const result = await asyncQuery(getData)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    getProductsByID: async (req, res) => {
        const id = parseInt(req.params.id)
        const checkId = `SELECT * FROM produk WHERE id=${id};`
        try {
            const result = await asyncQuery(checkId)
            if (result.length === 0) return res.status(500).send(`product with ${id} does not exist`)

            // display
            const query = `SELECT p.id, p.nama_produk, p.deskripsi, p.harga, p.stok, GROUP_CONCAT(k.kategori SEPARATOR '>') AS kategori FROM kategori k 
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
    getPage: async (req, res) => {
        const limit = parseInt(req.params.limit)
        const page = parseInt(req.params.page)
        const offset = limit * (page-1)
        try {
            const query = `SELECT * FROM produk LIMIT ${limit} OFFSET ${offset};`
            const result = await asyncQuery(query)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    addProduct: async (req, res) => {
        const { nama, deskripsi, harga, stok } = req.body
        const checkName = `SELECT * FROM produk WHERE nama_produk='${nama}';`
        try {
            // check product exist
            const check = await asyncQuery(checkName)
            console.log(check)
            if (check.length !== 0) return res.status(500).send(`product with ${nama} already exist`)

            // // add
            const addCategory = `INSERT INTO produk (nama_produk, deskripsi, harga, stok) VALUES ('${nama}', '${deskripsi}', '${harga}', '${stok}');`
            const result = await asyncQuery(addCategory)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    deleteProduct: async (req, res) => {
        const id = parseInt(req.params.id)
        const checkId = `SELECT * FROM produk WHERE id=${id};`
        try {
            // check product exist
            const result = await asyncQuery(checkId)
            if (result.length === 0) return res.status(500).send(`product with ${id} does not exist`)

            const query = `DELETE FROM produk WHERE id = ${id}`
            const deleteQuery = await asyncQuery(query)
            console.log(deleteQuery)
            res.status(200).send(deleteQuery)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    },
    editProduct: async (req, res) => {
        const id = parseInt(req.params.id)
        const checkId = `SELECT * FROM produk WHERE id=${id};`
        try {
            // check product exist
            const check = await asyncQuery(checkId)
            if (check.length === 0) return res.status(500).send(`product with ${id} does not exist`)

            // edit product
            const edit = `UPDATE produk SET ${generateQuery(req.body)} WHERE id = '${id}';`
            const result = await asyncQuery(edit)
            res.status(200).send(result)
        } catch (err) {
            console.log(err)
            res.status(500).send(err)
        }
    }
}