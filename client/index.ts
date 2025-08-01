import express from "express";
const router = express.Router();
import registerRoutes from "./services/registerRoutes";
import { ControllerGroup } from "@/types/controllerAttributes";

// PAGE IMPORTS:
import { getWelcomePage } from "./controller/home/welcome";
import { getLoginPage, postLoginPage } from "./controller/auth/login";
import { getRegisterPage } from "./controller/auth/register";

// ROUTES:
export const endpoints: ControllerGroup = {
    "": { 
        GET: { handler: getWelcomePage, auth: false }
    },
    auth: {
        login: {
            GET: { handler: getLoginPage, auth: false },
            POST: { handler: postLoginPage, auth: false },
        },
        register: {
            GET: { handler: getRegisterPage, auth: false }
        }
    }
}

registerRoutes(router, endpoints);

export default router;
