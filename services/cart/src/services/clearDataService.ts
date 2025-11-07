import redis from "@/config/redis"
import axios from "axios"
import { INVENTORY_SERVICE } from "../config/redisConfig"

const clearData = async(id: string)=>{
    try {
        const data = redis.hgetall(`cart${id}`)
        if(Object.keys(data).length === 0){
            return
        }


        const item = Object.keys(data).map((key)=>{
            const {quantity, inventoryId} = JSON.parse(data[key]) as {
                inventoryId: string,
                quantity: number
            }
            return{
                inventoryId,
                quantity,
                productId: key
            }
        }) 


        //update inventory
        const requests = item.map(item =>{
            return axios.put(`${INVENTORY_SERVICE}/inventories/${item.inventoryId}`, {
                quantity: item.quantity,
                actionType: "IN"
            })
        })

        Promise.all(requests)
        console.log('Inventory updated');

        await redis.del(`cart:${id}`)
        
    } catch (error) {
        console.log(error);
        
    }
}

export default clearData