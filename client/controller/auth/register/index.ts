import config from "@/config";
import axios, { AxiosError } from "axios";
import { Request, Response } from "express";

const getRegisterPage = async (
    req: Request,
    res: Response
) => {
    return res.render("auth/register");
}

const postRegisterPage = async (
    req: Request,
    res: Response
) => {
    const userData = req.body;

    try {
        await axios.post(`${config.serverUrl}/auth/register`, {
            firstName: userData.fullName,
            lastName: "Şahin",
            email: userData.email,
            password: userData.password,
            confirmPassword: userData.confirmPassword
        });

        return res.redirect("/dashboard");

    } catch (error) {
        console.error("İstekte bir hata gerçekleşti:", error instanceof AxiosError && error.response?.data);
        
        return res.redirect("/auth/register");
    }
}

export { getRegisterPage, postRegisterPage };
export default { getRegisterPage, postRegisterPage };
