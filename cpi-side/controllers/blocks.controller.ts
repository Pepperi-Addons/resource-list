
export async function loadBlock(req, res, next){
    try{
        console.log(`request recieved: ${JSON.stringify(req.body)}`);
        res.json({});
    }
    catch(err){
        next(err)
    }
}