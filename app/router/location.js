// IMPORTATIONS

import { Router } from 'express';
const router = Router();

import { createMap } from '../controller/mapController.js';
import { authenticateToken } from '../middleware/auth.js';

// ROUTES CAR

router.post('/map', authenticateToken, createMap);


export { router };


// IMPORTATIONS

/*import { Router } from 'express';
const router = Router();

import { fetchAllMaps, fetchOneMap, createMap, updateMap, deleteMap } from '../controller/mapController.js';

// ROUTES MAPS
//CHECK CREER LES CONTROLLERS/MODELS ET DATAMAPPER LIES
router.get('/maps', fetchAllMaps);
router.post('/map', createMap);

router.get('/map/:id', fetchOneMap);
//router.patch('/map/:id', updateMap);
//router.delete('/map/:id', deleteMap);*/

