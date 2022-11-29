import '@pepperi-addons/cpi-node'
import { router as genericResourceRouter }  from './routes/generic-resource.route'
export async function load(configuration: any) {
    console.log('cpi side works!');
    // Put your cpi side code here
}

export const router = Router()
//routes:

//generic resources routes
router.use('/resources', genericResourceRouter)
