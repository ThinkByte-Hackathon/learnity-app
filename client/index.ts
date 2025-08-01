import express from "express";
const router = express.Router();
import registerRoutes from "./services/registerRoutes";
import { ControllerGroup } from "@/types/controllerAttributes";

// PAGE IMPORTS:
import { getWelcomePage } from "./controller/home/welcome";
import { getLoginPage } from "./controller/auth/login";

// ROUTES:
export const endpoints: ControllerGroup = {
    "": { 
        GET: { handler: getWelcomePage, auth: false }
    },
    auth: {
        login: {
            GET: { handler: getLoginPage, auth: false }
        }
    }
}

registerRoutes(router, endpoints);

export default router;
