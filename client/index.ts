import express from "express";
const router = express.Router();
import registerRoutes from "./services/registerRoutes";
import { ControllerGroup } from "@/types/controllerAttributes";

// PAGE IMPORTS:
import { getWelcomePage } from "./controller/home/welcome";

// ROUTES:
export const endpoints: ControllerGroup = {
    "": { 
        GET: { handler: getWelcomePage, auth: false }
    },
}

registerRoutes(router, endpoints);

export default router;
