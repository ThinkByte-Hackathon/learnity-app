import express from "express";
const router = express.Router();
import registerRoutes from "./services/registerRoutes";
import { ControllerGroup } from "@/types/controllerAttributes";

// PAGE IMPORTS:
import { getWelcomePage } from "./controller/home/welcome";
import { getLoginPage, postLoginPage } from "./controller/auth/login";
import { getRegisterPage, postRegisterPage } from "./controller/auth/register";
import { getDashboardPage } from "./controller/home/dashboard";

// ROUTES:
export const endpoints: ControllerGroup = {
    home: {
        GET: { handler: getWelcomePage, auth: false },
    },
    dashboard: {
        GET: { handler: getDashboardPage, auth: true }
    },
    auth: {
        login: {
            GET: { handler: getLoginPage, auth: false },
            POST: { handler: postLoginPage, auth: false },
        },
        register: {
            GET: { handler: getRegisterPage, auth: false },
            POST: { handler: postRegisterPage, auth: false }
        }
    }
}

registerRoutes(router, endpoints);

export default router;
