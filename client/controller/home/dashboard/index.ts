import { Request, Response } from "express";

const getDashboardPage = async (
    req: Request,
    res: Response
) => {
    return res.render("home/dashboard");
}

export { getDashboardPage };
export default { getDashboardPage };
