const router = require('express').Router()
const DB_QUERY_SYNC = require('../../database/query')
const auth = require('../../middleware/auth')

router.use(auth('buyer'))


router.get('/list-of-sellers', async (req, res) => {
    try{

        const sellers_data = await DB_QUERY_SYNC('Select id from sellers;', [])
        if(sellers_data.error){
            return res.status(500).send({
                message:"due to some internal issue we failed fetch sellers list."
            })
        }

        res.send({
            sellers: sellers_data.data
        })
    } catch(error) {
        console.log(error)
        res.status(500).send({
            error:true,
            message:"Internal server error"
        })
    }
})

router.get('/seller-catalog/:seller_id', async (req, res) => {
    try{
        const {seller_id} = req.params
        console.log(seller_id)
        if(!seller_id){
            return res.status(422).send({
                message: "Seller ID is requred is missing."
            })
        }

        if(isNaN(seller_id)){
            return res.status(422).send({
                message: "Seller ID is must be numeric."
            })
        }

        const products_data = await DB_QUERY_SYNC('Select id, name, price from products  where seller_id = ?;', [seller_id])
        if(products_data.error){
            return res.status(500).send({
                message:"due to some internal issue we failed fetch product list."
            })
        }

        if(products_data.data.length == 0){
            return res.status(404).send({
                message: "There is no catalog for the seller you are looking for."
            })
        }

        res.send({
            products: products_data.data
        })
    } catch(error) {
        console.log(error)
        res.status(500).send({
            error:true,
            message:"Internal server error"
        })
    }
})

router.post('/create-order/:seller_id', async (req, res) => {
    try{

        //verifying seller id
        const {seller_id} = req.params
        if(!seller_id){
            return res.status(422).send({
                message: "Seller ID is requred is missing."
            })
        }

        if(isNaN(seller_id)){
            return res.status(422).send({
                message: "Seller ID is must be numeric."
            })
        }

        const seller_exesist = await DB_QUERY_SYNC('Select * from sellers where id = ?;', [seller_id])
        if(seller_exesist.error || seller_exesist.data.length == 0){
            return res.status(404).send({
                message:"seller not found."
            })
        }


        //inserting order to db
        let items = req.body

        if(!items || !Array.isArray(items)){
            return res.status(422).send({
                message: "itmes array is missing or invalid, it must be an array/list of product id's."
            })
        }

        if(items.length == 0){
            return res.status(422).send({
                message: "Items must contain atleast one proudct."
            })
        }

        const invalid_items = []
        const valid_items = []

        for(let i = 0;i < items.length;i++){
            let product_id = items[i]
            if(!product_id){
                invalid_items.push({product_id, message: "missing."})
                continue
            }

            if(isNaN(Number(product_id))){
                invalid_items.push({product_id, message: "product_id must be numeric."})
                continue
            }

            const proudct_exesist = await DB_QUERY_SYNC(`select id from products where id = ? and seller_id = ?;`, [product_id, seller_id])
            if(proudct_exesist.status == 0 || proudct_exesist.data.length == 0){
                invalid_items.push({product_id, message: "product fot given product id and seller id not found."})
                continue
            }

            valid_items.push(product_id)
        }

        if(invalid_items.length){
            return res.status(422).send({
                message:"Some items are not valid",
                valid_items,
                invalid_items
            })
        }

        const place_order = await DB_QUERY_SYNC(`Insert into orders(buyer_id, seller_id, items) Values (?,?,?);`, [Number(req.user_id), Number(seller_id), JSON.stringify(items)])
        if(place_order.error){
            return res.status(500).send({
                message: "due to some internal issue, we are not able to place your order, please try again after sometime."
            })
        }

        res.send({
            message: "Your order have been placed successfully!"
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