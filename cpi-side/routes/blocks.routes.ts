import { loadBlock } from "../controllers/blocks.controller"

export const router = Router()

router.post('/load', loadBlock)