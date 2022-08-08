import { _500 } from "./errorController.js";
import { Road } from "../model/road.js";


async function fetchAllRoads(req, res){
    try{
        const road = await Road.findAllRoads(req.user.id);
        res.json(road);
    } catch(err) {
        _500(err,req, res);
    }
}

export { fetchAllRoads }