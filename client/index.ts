import express from "express";
const router = express.Router();
import registerRoutes from "./services/registerRoutes";
import { ControllerGroup } from "@/types/controllerAttributes";
import { getAskAwayPage, sendChatMessage, analyzeChatImage, clearChatHistory, sendGeminiRequest } from "./controller/ai_modules/askaway";

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
    },
    chat: {
        home: {
            GET: {handler: getAskAwayPage, auth: false}
        },
        send: {
            GET: {handler: sendChatMessage, auth: false}
        },
        image: {
            GET: {handler: analyzeChatImage, auth: false}
        },
        history: {
            GET: {handler: clearChatHistory, auth: false}
        }
    },
    gemini: {
        send: {
            POST: {handler: sendGeminiRequest, auth: true}
        }
    }
}

registerRoutes(router, endpoints);

export default router;
