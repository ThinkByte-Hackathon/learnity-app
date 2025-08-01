import { Request, Response } from "express";

const getLoginPage = async (
    req: Request,
    res: Response
) => {
    return res.render("auth/login");
}

export { getLoginPage };
export default { getLoginPage };
