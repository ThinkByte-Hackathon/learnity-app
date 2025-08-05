import { Request, Response } from "express";

const getNothorPage = async (
    req: Request,
    res: Response
) => {
    try {
        // AI Not Asistanı ana sayfasını render et
        return res.render("ai_modules/nothor/index");
    } catch (error) {
        console.error("Nothor page error:", error);
        return res.status(500).render("error", { 
            message: "AI Not Asistanı sayfası yüklenirken bir hata oluştu." 
        });
    }
}

export { getNothorPage };
export default { getNothorPage };
