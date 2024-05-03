import { Router } from "express";
import UserModel from "../models/usuario.model.js";
import { isValidPassword } from "../utils/hashbcrypt.js";

const router = Router();

const admin = {
    email: "adminCoder@coder.com",
    password: "adminCod3r123"
}
router.post("/login", async (req, res) => {
    const {email, password} = req.body;

    try {
        if (email === admin.email) {
            if (password === admin.password) {

                console.log("Admin!!")
                    req.session.login = true;
                    req.session.user = {
                        email: admin.email,
                        first_name: "Coder",
                        last_name: "House",
                        role: "admin"
                    }

                    res.redirect("/realtimeproducts");
                    return
            
            } else { 
                res.status(401).send("usuario o contraseña incorrecto") 
                return
            }
        }

        const user = await UserModel.findOne({email: email});
        if (user) {
            if (isValidPassword(password, user)) {
                req.session.login = true;
                req.session.user = {
                    email: user.email,
                    first_name: user.first_name,
                    role: user.role
                }
                res.redirect("/products");
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