import { getGenericView, getSelectionList } from "../controllers/views.controller"

export const router = Router()

//routes:

//get the generic view 
router.get('/generic_view', getGenericView)
router.get('/selection_list', getSelectionList)



