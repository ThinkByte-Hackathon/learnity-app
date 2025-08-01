import { Request, Response } from "express";

const getRegisterPage = async (
    req: Request,
    res: Response
) => {
    return res.render("auth/register");
}

export { getRegisterPage };
export default { getRegisterPage };
