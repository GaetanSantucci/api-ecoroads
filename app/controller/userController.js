//~ IMPORTATION ERROR
import { _400, _404, _500 } from "./errorController.js";
import { User } from "../model/user.js";
import { Location } from "../model/location.js";
import { Category } from "../model/category.js";

import { generateAccessToken, generateRefreshToken } from "../utils/jwtToken.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import emailValidator from "email-validator";
import passwordValidator from "password-validator";

import { validation } from "../service/validation.js";
import { usernameSchema } from "../schema/user.js";

const schema = new passwordValidator();
const worthPassword = ["Passw0rd", "Password123", "Azerty", "Qwerty", "000000", "123456"];
schema
    .is()
    .min(6)
    .has()
    .uppercase(1)
    .has()
    .symbols(1)
    .has()
    .not()
    .spaces()
    .is()
    .not()
    .oneOf(worthPassword);
/* .is().max(100) // Maximum length 100
.has().lowercase(1) // Must have lowercase letters
.has().digits(2) // Must have at least 2 digits
.has().symbols(1) // Must have at least 1 symbol
.has().not().spaces() // Should not have spaces
.is().not().oneOf() */

// FUNCTIONS

// ------------------------------------------------------- FETCH ALL USERS
// ------------------------------------------------------------------------

async function fetchAllUsers(req, res) {
    try {
        const user = await User.findAllUsers();

        if (user) res.status(200).json(user);
        else throw new Error({ error: "Aucun utilisateur trouvé" });
    } catch (err) {
        _500(err, req, res);
    }
}

// ------------------------------------------------------- FETCH ONE USER
// -----------------------------------------------------------------------

async function fetchOneUser(req, res) {
    try {
        const userId = req.user.id;
        if (!userId) return res.status(401).json({ error: "Autorisation refusée" });
        const user = await User.findOneProfile(userId, "id");
        
        console.log("dans le user profile ligne 65",{refresh :  req.cookies.refreshToken});
        delete req.cookies.refreshToken;
        
        console.log("dans le user profile  ligne 68", req.cookies);
        
        if (user) res.status(200).json(user.rows[0]);
        else throw new Error({ error: "L'utilisateur n'existe pas" });
        
    } catch (err) {
        return _500(err, req, res);
    }
    req.session.user = req.user
    console.log("req.user dans user porfil", req.session.user);
}

// ------------------------------------------------------- LOGIN USER
// -------------------------------------------------------------------

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        // verify if the email exists
        if (!email)
        return res.status(400).json({ error: "Merci de bien vouloir renseigner l'email" });
        // verify if email is valid
        if (!emailValidator.validate(email))
        return res.status(401).json({ error: "Le format de l'email est incorrect" });
        
        const user = await User.findOneUser(email, "email");
        
        if (user.rowCount === 0) return res.status(401).json({ error: "Aucun utilisateur trouvé" });
        
        // verify if password is the same with user.password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(401).json({ error: "Mot de passe incorrect" });
        
        // delete user.password;
        const { ["password"]: remove, ...userJwt } = user.rows[0];

        //~ Create token JWT
        let accessToken = generateAccessToken(userJwt);
        let refreshToken = generateRefreshToken(userJwt);
        
        req.session.refreshToken = refreshToken
        
        res.cookie("refreshToken", refreshToken, {
            ...(process.env.COOKIE_DOMAIN && {domain: process.env.COOKIE_DOMAIN}),
            httpOnly: true,
            sameSite: "none",
            // secure: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        
        console.log(req.cookies);
        
        res.status(200).send({ accessToken : accessToken});
    } catch (err) {
        return _500(err, req, res);
    }
}

// ------------------------------------------------------- LOGOUT USER
// --------------------------------------------------------------------

async function logoutUser(req, res) {
    try {
        const token = req.session.refreshToken;

        if (!token) return res.status(401).json({ error: "Token invalide" });

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(401);
            }
            if (!user) return res.status(401).json({ error: "L'utilisateur n'existe pas" });
            req.user = user;
            return token;
        });
        req.user = null;
        req.session.destroy();

        res.json("Utilisateur deconnecté");
    } catch (err) {
        _500(err, req, res);
    }
}

// ------------------------------------------------------- CREATE USER
// -------------------------------------------------------------------

async function createUser(req, res) {
    try {
        let { email, password, username } = req.body;

        const user = await User.findOneUser(email, "email");

        if (user.rowCount !== 0) throw new Error(`${email} existe déjà.`);

        if (req.body.location !== undefined && isNaN(req.body.location)) {
            const existingLocation = await Location.findOrCreateLocation(req.body.location);
            if (existingLocation) req.body.location = existingLocation;
        }

        if (!emailValidator.validate(email))
            return res.status(500).json({ error: `L'email n'est pas valide.` });
        if (!schema.validate(password))
            return res.status(500).json({
                error: "Le mot de passe doit contenir au moins 6 caractères, une majuscule et un caractère spécial.",
            });
        req.body.password = await bcrypt.hash(password, 10);
        if (!username)
            return res.status(500).json({ error: "Merci de renseigner un nom d'utilisateur" });

        await User.createUser(req.body);

        res.status(200).json({ message: "L'utilisateur a bien été créé" });
    } catch (err) {
        _500(err, req, res);
    }
}

// ------------------------------------------------------- UPDATE USER
// --------------------------------------------------------------------

async function updateUser(req, res) {
    try {
        // I retrieve the id put in the req.session
        const userId = req.user.id;
        let { email, password, username } = req.body;
        // I verify if the user exist in the database
        let user = await User.findOneUser(userId, "id");

        if (!user) return res.status(401).json({ error: "L'utilisateur n'existe pas" });

        if (req.body.location !== undefined && isNaN(req.body.location)) {
            const existingLocation = await Location.findOrCreateLocation(req.body.location);
            if (existingLocation) req.body.location = existingLocation;
        }

        if (req.body.categories) await Category.updateCategories(req.body.categories, userId);
        
        if(email){  
        if (!emailValidator.validate(email))
            return res.status(500).json({ error: `${email} invalide !` });
        }

        if(password === "") {
            req.body.password = user.rows[0].password;
        }else{
            console.log("please test");
            if (!schema.validate(password))
            return res
            .status(500)
            .json({
                error: "Le mot de passe doit contenir au moins 6 caractères, une majuscule et un caractère spécial.",
            });
            req.body.password = await bcrypt.hash(password, 10);
        }

        if (username) validation.body(usernameSchema);
        
        await User.updateUser(userId, req.body);

        res.status(200).json({ message: "L'utilisateur a bien été mis à jour" });
    } catch (err) {
        _500(err, req, res);
    }
}

// ------------------------------------------------------- DELETE USER
// --------------------------------------------------------------------

async function deleteUser(req, res) {
    try {
        const userId = req.user.id;
        await User.deleteUser(userId);

        return res.status(200).json({ message: `L'utilisateur a bien été supprimé` });
    } catch (err) {
        _500(err, req, res);
    }
}

// ------------------------------------------------------- REFRESH TOKEN
// ----------------------------------------------------------------------

async function refreshToken(req, res) {
    const token = req.session.refreshToken

    if (!token) {
        return res.status(401);
    }
    jwt.verify(req.session.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("🚀 ~ file: userController.js ~ line 246 ~ jwt.verify ~ err", err)
            return res.status(401).json(`L'utilisateur n'existe pas`);
        }
        delete user.iat;
        delete user.exp;
        const refreshedAccessToken = generateAccessToken(user);

        res.status(200).json({ refreshedAccessToken: refreshedAccessToken });
    });
}

export {
    fetchAllUsers,
    fetchOneUser,
    loginUser,
    logoutUser,
    createUser,
    updateUser,
    deleteUser,
    refreshToken,
};
