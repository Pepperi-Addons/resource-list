import { getItems, postItem, getResource, getByKey } from "../controllers/generic-resource.controller"



export const router = Router()

//routes:

/**
 * get Items of resource.
 * using post request because get request url is limited to 2,048 bytes, with post we can use the body to pass arguments.
 * body: {
 *  where: query 
 * }
 */
router.post('/get_items/:resource', getItems)

//post data item for the specific resource
router.post('/post_item/:resource', postItem)

//get the metadata of the specific resource
router.get('/:resource', getResource)

//get item by it's key
router.get('/get_by_key/:resource/:key', getByKey)


