import { Request, Response } from "express";

const getWelcomePage = async (
    req: Request,
    res: Response
) => {
    return res.render("home/welcome");
}

export { getWelcomePage };
export default { getWelcomePage };
