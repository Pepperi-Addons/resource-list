import { getItems, postItem, getResource } from "../controllers/generic-resource.controller"
import * as express from 'express'


export const router = express.Router()

//routes:

//get the data of the specific resource
router.get('/:resource/items', getItems)

//post data item for the specific resource
router.post('/:resource/items', postItem)

//get the metadata of the specific resource
router.get('/:resource', getResource)



