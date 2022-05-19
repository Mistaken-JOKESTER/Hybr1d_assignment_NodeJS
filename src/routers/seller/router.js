const router = require('express').Router()
const DB_QUERY_SYNC = require('../../database/query')
const auth = require('../../middleware/auth')

router.use(auth('seller'))


router.post('/create-catalog', async (req, res) => {
    try{
        let items = req.body

        if(!items || !Array.isArray(items)){
            return res.status(422).send({
                message: "catalog itmes array is missing or invalid, it must be an array/list of items."
            })
        }

        if(items.length == 0){
            return res.status(422).send({
                message: "catalog must contain atleast one item."
            })
        }

        const invalid_items = []
        const valid_items = []
        let catalog_query = `Delete from products where seller_id = ?;Insert into products(name, price, seller_id) Values `
        const catalog_query_data = [Number(req.user_id)]

        for(let i = 0;i < items.length;i++){
            let item = items[i]
            if(!item.name || !item.price){
                invalid_items.push({...item, message: "name or price missing."})
                continue
            }

            if(typeof item.name !== 'string' || item.name.length > 60 || isNaN(Number(item.price))){
                invalid_items.push({...item, message: "Invalid item name must be string of not more than 60 characters or price must be numeric."})
                continue
            }

            valid_items.push(item)
            catalog_query += `(?,?,?),`
            catalog_query_data.push(item.name, Number(item.price), req.user_id)
        }

        if(invalid_items.length){
            return res.status(422).send({
                message:"Some items are not valid",
                valid_items,
                invalid_items
            })
        }

        const insert_items = await DB_QUERY_SYNC(catalog_query.slice(0, -1) + ';', catalog_query_data)
        if(insert_items.error){
            return res.status(500).send({
                message:"due to some internal issue we failed to add your items, please try again after sometime."
            })
        }

        res.send({
            message:"Your items are added successfully."
        })
    } catch(error) {
        console.log(error)
        res.status(500).send({
            error:true,
            message:"Internal server error"
        })
    }
})

router.get('/orders', async (req, res) => {
    try{

        const orders_data = await DB_QUERY_SYNC('Select id, buyer_id, items from orders where seller_id = ?;', [req.user_id])
        if(orders_data.error){
            return res.status(500).send({
                message:"due to some internal issue we failed fetch orders list."
            })
        }

        // for (let i = 0; i < orders_data.data.length; i++) {
        //     orders_data.data[i].items = JSON.parse(orders_data.data[i].items)
        // }

        res.send({
            orders: orders_data.data
        })
    } catch(error) {
        console.log(error)
        res.status(500).send({
            error:true,
            message:"Internal server error"
        })
    }
})

module.exports = router