// IMPORTATIONS

import { Router } from 'express';
const router = Router();

import { createMap } from '../controller/mapController.js';
import { authenticateToken } from '../middleware/auth.js';

router.post('/map', authenticateToken, createMap);


export { router };

