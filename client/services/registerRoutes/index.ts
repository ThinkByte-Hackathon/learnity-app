import express from "express";
import { ControllerGroup, ControllerAttributes } from "@/types/controllerAttributes";
import isAuthForClient from "@/middlewares/auth/isAuthForClient";

const registerRoutes = (router: express.Router, endpoints: ControllerGroup, basePath: string = "") => {
    Object.keys(endpoints).forEach(key => {
        const currentPath = basePath ? `${basePath}/${key}` : key;
        const value = endpoints[key];

        // Eğer bu bir ControllerAttributes ise (handler property'si varsa)
        if (isControllerAttributes(value)) {
            // Bu bir endpoint
            const url = `/${currentPath}`;
            
            const middlewares: express.RequestHandler[] = [];
            if (value.auth) {
                middlewares.push(isAuthForClient);
            }

            router.get(url, ...middlewares, value.handler as express.RequestHandler);

        } else if (typeof value === 'object' && value !== null) {

            const httpMethods = Object.keys(value);            

            if (httpMethods.some(method => ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].includes(method.toUpperCase()))) {

                httpMethods.forEach(method => {
                    const methodValue = value[method];
                    if (isControllerAttributes(methodValue)) {
                        const url = `/${currentPath}`;
                        
                        const middlewares: express.RequestHandler[] = [];
                        if (methodValue.auth) {
                            middlewares.push(isAuthForClient);
                        }

                        // Client tarafında sadece GET ve POST destekleniyor
                        if (method.toUpperCase() === 'GET') {
                            router.get(url, ...middlewares, methodValue.handler as express.RequestHandler);
                        } else if (method.toUpperCase() === 'POST') {
                            router.post(url, ...middlewares, methodValue.handler as express.RequestHandler);
                        }
                    }
                });
            } else {
                registerRoutes(router, value, currentPath);
            }
        }
    });
};

// Type guard function
function isControllerAttributes(obj: any): obj is ControllerAttributes {
    return obj && typeof obj === 'object' && typeof obj.handler === 'function' && typeof obj.auth === 'boolean';
}

export default registerRoutes;
