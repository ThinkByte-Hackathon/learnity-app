import config from "@/config";
import axios, { AxiosError } from "axios";
import { Request, Response } from "express";

// Sayfayı açan fonksiyon:
const getLoginPage = async (
    req: Request,
    res: Response
) => {

    /*
    // İsteği at ve verileri al:
    try {
        const response = await axios.get("");

        // İstek başarılıysa kod buradan devam edecek.

        return res.render("auth/login", {
            notes: response.data.notes
        });
    } catch (error) {
        // Api hata dönerse buraya gelecek kod.
    }
    */

    return res.render("auth/login");
}

// Sayfadaki formu kullanıcı gönderdiğinde çalışan fonksiyon:
const postLoginPage = async (
    req: Request,
    res: Response
) => {
    const userData = req.body;

    try {
        const response = await axios.post(config.serverUrl + "/auth/login", {
            email: userData.email,
            password: userData.password
        });

        console.log("Login isteği başarılı:", response.data);
        
    } catch (error) {
        console.error("Login isteği başarısız oldu! Response:", error instanceof AxiosError && error.response?.data);
    }
}

export { getLoginPage, postLoginPage };
export default { getLoginPage, postLoginPage };
