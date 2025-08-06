import express from "express";
const router = express.Router();
import registerRoutes from "./services/registerRoutes";
import { ControllerGroup } from "@/types/controllerAttributes";

// PAGE IMPORTS:
import { getWelcomePage } from "./controller/home/welcome";
import { getLoginPage, postLoginPage } from "./controller/auth/login";
import { getRegisterPage, postRegisterPage } from "./controller/auth/register";
import { getDashboardPage } from "./controller/home/dashboard";
import { getNothorPage } from "./controller/ai_modules/nothor";
import { getGenerateNothorPage, createNote } from "./controller/ai_modules/nothor/generate_nothor";
import { getCompleteNothorPage, completeNote } from "./controller/ai_modules/nothor/complete_nothor";
import { getAskAwayPage } from "./controller/ai_modules/askaway";
import { getQuiztorPage, createQuestion } from "./controller/ai_modules/quiztor";

// ROUTES:
export const endpoints: ControllerGroup = {
    "": {
        GET: { handler: getWelcomePage, auth: false },
    },
    dashboard: {
        GET: { handler: getDashboardPage, auth: true }
    },
    "ai_modules/nothor": {
        GET: { handler: getNothorPage, auth: false }
    },
    "ai_modules/nothor/generate_nothor": {
        GET: { handler: getGenerateNothorPage, auth: false },
        POST: { handler: createNote, auth: false }
    },
    "ai_modules/nothor/complete_nothor": {
        GET: { handler: getCompleteNothorPage, auth: false },
        POST: { handler: completeNote, auth: false }
    },
    "ai_modules/askaway": {
        GET: { handler: getAskAwayPage, auth: false }
    },
    "ai_modules/quiztor": {
        GET: { handler: getQuiztorPage, auth: false },
        POST: { handler: createQuestion, auth: false }
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
