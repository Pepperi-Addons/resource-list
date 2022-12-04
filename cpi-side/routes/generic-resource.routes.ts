import { getItems, postItem, getResource, getAllResources } from "../controllers/generic-resource.controller"



export const router = Router()

//routes:

//get all resources metadata
router.get('/resources', getAllResources)


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



