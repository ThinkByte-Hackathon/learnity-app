import { NextFunction, Request, Response } from "express";
import axios from "axios";
import config from "@/config";

const isAuthForClient = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const apiUrl = `${config.serverUrl}/auth/check`;

        const response = await axios.get(apiUrl, {
            headers: {
                'Cookie': req.headers.cookie || ''
            },
            timeout: 5000,
            validateStatus: (status: number) => status < 500 // 500'den küçük statusları kabul et
        });

        // Oturum geçerliyse devam et
        if (response.status === 200 && response.data.status) {
            req.isSessional = true;
            next();

        } else {
            console.log("Oturum başarısız:", response.data);
            
            // Oturum geçersizse home sayfasına yönlendir
            res.redirect("/home");
        }

    } catch (error: any) {
        console.log("Auth check failed:", error.message);
        res.redirect("/home");
    }
};

export default isAuthForClient;
