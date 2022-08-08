import { Router } from 'express';
const router = Router();

import { fetchAllRoads } from "../controller/roadController.js";
import { authenticateToken } from "../middleware/auth.js";

router.get('/roads', authenticateToken, fetchAllRoads)

export { router };