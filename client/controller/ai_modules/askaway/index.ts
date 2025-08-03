import config from "@/config";
import axios, { AxiosError } from "axios";
import { Request, Response } from "express";

// AskAway sayfasını açan fonksiyon
const getAskAwayPage = async (
    req: Request,
    res: Response
) => {
    try {
        // AskAway sayfasını render et
        return res.render("ai_modules/askaway/index");
        
    } catch (error) {
        console.error("AskAway sayfası yüklenirken hata oluştu:", error);
        return res.status(500).render("error", { 
            message: "AskAway sayfası yüklenirken bir hata oluştu." 
        });
    }
};

// Chat mesajı gönderme fonksiyonu (Backend API'ye forward eder)
const sendChatMessage = async (
    req: Request,
    res: Response
) => {
    const chatData = req.body;

    try {
        const response = await axios.post(config.serverUrl + "/api/chat/send", {
            message: chatData.message,
            chatHistory: chatData.chatHistory
        });

        console.log("Chat API yanıtı başarılı:", response.data);

        return res.json({
            success: true,
            response: response.data.response
        });

    } catch (error) {
        console.error("Chat API hatası:", error instanceof AxiosError ? error.response?.data : error);

        return res.status(500).json({
            success: false,
            error: "Mesaj gönderilemedi. Lütfen tekrar deneyin."
        });
    }
};

// Görsel analizi fonksiyonu (Backend API'ye forward eder)
const analyzeChatImage = async (
    req: Request,
    res: Response
) => {
    const imageData = req.body;

    try {
        const response = await axios.post(config.serverUrl + "/api/chat/image", {
            imageData: imageData.imageData,
            message: imageData.message
        });

        console.log("Chat Image API yanıtı başarılı:", response.data);

        return res.json({
            success: true,
            response: response.data.response
        });

    } catch (error) {
        console.error("Chat Image API hatası:", error instanceof AxiosError ? error.response?.data : error);

        return res.status(500).json({
            success: false,
            error: "Görsel işlenemedi. Lütfen tekrar deneyin."
        });
    }
};

// Chat geçmişini temizleme fonksiyonu (Backend API'ye forward eder)
const clearChatHistory = async (
    req: Request,
    res: Response
) => {
    try {
        const response = await axios.delete(config.serverUrl + "/api/chat/history");

        console.log("Chat History Clear API yanıtı başarılı:", response.data);

        return res.json({
            success: true,
            message: "Chat geçmişi temizlendi"
        });

    } catch (error) {
        console.error("Chat geçmişi temizleme hatası:", error instanceof AxiosError ? error.response?.data : error);

        return res.status(500).json({
            success: false,
            error: "Chat geçmişi temizlenemedi"
        });
    }
};

// Gemini API'ye prompt gönderme fonksiyonu
const sendGeminiRequest = async (
    req: Request,
    res: Response
) => {
    const { prompt } = req.body;

    try {
        const response = await axios.post(config.serverUrl + "/gemini/send", {
            prompt: prompt
        });

        console.log("Gemini API yanıtı başarılı:", response.data);

        return res.json({
            success: true,
            response: response.data.response
        });

    } catch (error) {
        console.error("Gemini API hatası:", error instanceof AxiosError ? error.response?.data : error);

        return res.status(500).json({
            success: false,
            error: "Gemini isteği gönderilemedi. Lütfen tekrar deneyin."
        });
    }
};


export { getAskAwayPage, sendChatMessage, analyzeChatImage, clearChatHistory, sendGeminiRequest };
export default { getAskAwayPage, sendChatMessage, analyzeChatImage, clearChatHistory, sendGeminiRequest };