// ~ *** *** ROUTER CONFIG *** *** ~ //
// ~ ***************************** ~ //

import { Router } from "express";
const router = Router();
import {
    createUser,
    fetchOneUser,
    loginUser,
    logoutUser,
    updateUser,
    deleteUser,
    fetchAllUsers,
    refreshToken,
} from "../controller/userController.js";

// ~ *** *** IMPORT JWT *** *** ~ //
// ~ ************************** ~ //

import { authenticateToken } from "../middleware/auth.js";

// ~ *** *** SCHEMA CONFIG *** *** ~ //
// ~ ***************************** ~ //

import { userSchema } from "../schema/user.js";
import { validation } from "../service/validation.js";

// ~ *** *** ROUTE *** *** ~ //
// ~ ********************* ~ //

router.get("/users", fetchAllUsers);
// connection
router.post("/user/register", validation.body(userSchema), createUser);

router.post("/user/login", loginUser);
router.get("/user/logout", logoutUser);
// profile routes
router.get("/user/profile", authenticateToken, fetchOneUser);
router.patch("/user/profile",authenticateToken, updateUser);
router.delete("/user/profile",authenticateToken ,deleteUser);


//refreshToken
router.get("/refresh_token", refreshToken);

export { router };
