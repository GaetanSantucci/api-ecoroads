import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
    res.send(
        'Hello la team de choc ! Cliquez <a href="https://eco-roads.herokuapp.com/api-docs/#/" target="_blank" > <strong>ici</strong> </a> pour accéder à la doc',
    );
});

import { router as userRouter } from "./users.js";
router.use("/api/v1", userRouter);

import { router as carRouter } from "./car.js";
router.use("/api/v1", carRouter);

import { router as brandRouter } from "./brand.js";
router.use("/api/v1", brandRouter);

import { router as categoryRouter } from "./category.js";
router.use("/api/v1", categoryRouter);

import { router as locationRouter } from "./location.js";
router.use("/api/v1", locationRouter);

import { router as teamRouter } from "./team.js";
router.use("/api/v1", teamRouter);

import { router as roadRouter } from "./road.js";
router.use("/api/v1", roadRouter);

export { router };
