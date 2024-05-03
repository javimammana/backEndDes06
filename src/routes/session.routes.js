import { Router } from "express";
import UserModel from "../models/usuario.model.js";
import { isValidPassword } from "../utils/hashbcrypt.js";

const router = Router();

router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await UserModel.findOne({email: email});
        if (user) {
            if (isValidPassword(password, user)) {
                req.session.login = true;
                req.session.user = {
                    email: user.email,
                    first_name: user.first_name,
                    role: user.role
                }
                res.redirect("/profile");
            } else {
                res.status(401).send("usuario o contraseña incorrecto")
            }
        } else {
            res.status(401).send("usuario o contraseña incorrecto")
        }
    } catch (error) {
        res.status (400).send("Error en el Login")
    }
})

router.get("/logout", (req, res) => {
    if(req.session.login) {
        req.session.destroy();
    }

    res.redirect("/login")
})

export default router;