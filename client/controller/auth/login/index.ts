import config from "@/config";
import axios, { AxiosError } from "axios";
import { Request, Response } from "express";
import setCookie from "@/services/cookie/set";

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
        console.log("Response headers:", response.headers);

        // Server'dan gelen set-cookie header'ını direkt olarak forward et
        const setCookieHeaders = response.headers['set-cookie'];
        console.log("Set-Cookie headers:", setCookieHeaders);
        
        if (setCookieHeaders && setCookieHeaders.length > 0) {
            // Server'dan gelen cookie'leri direkt olarak client'a forward et
            res.setHeader('Set-Cookie', setCookieHeaders);
            console.log("Set-Cookie headers forwarded to client");
        } else {
            console.log("No set-cookie headers found");
        }

        return res.redirect("/dashboard");

    } catch (error) {
        console.error("Login isteği başarısız oldu! Response:", error instanceof AxiosError && error.response?.data);

        return res.redirect("/auth/login");
    }
}

export { getLoginPage, postLoginPage };
export default { getLoginPage, postLoginPage };
