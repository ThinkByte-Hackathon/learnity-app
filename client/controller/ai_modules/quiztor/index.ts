import { Request, Response } from 'express';
import axios from 'axios';
import config from "@/config";



// Render Quiztor page
export const renderQuiztor = async (req: Request, res: Response) => {
    try {
        res.render('ai_modules/quiztor/index', {
            title: 'Quiztor - AI Soru Üretici',
            user: req.user || null
        });
    } catch (error) {
        console.error('Quiztor render error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Sayfa yüklenirken hata oluştu' 
        });
    }
};

// Create questions via Gemini API
export const createQuestion = async (req: Request, res: Response) => {
    try {
        const { subject, type, piece } = req.body;

        // Validate input
        if (!subject || !type || !piece) {
            return res.status(400).json({
                success: false,
                error: 'Konu, zorluk seviyesi ve soru sayısı gereklidir'
            });
        }

        // Validate question count
        if (piece < 1 || piece > 5) {
            return res.status(400).json({
                success: false,
                error: 'Soru sayısı 1 ile 5 arasında olmalıdır'
            });
        }

        // Validate difficulty type
        const validTypes = ['easy', 'normal', 'hard'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                error: 'Geçersiz zorluk seviyesi'
            });
        }

        console.log('Creating questions with params:', { subject, type, piece });

        // Call backend API
        const response = await axios.post(`${config.serverUrl}/gemini/createQuestion`, {
            subject,
            type,
            piece
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Cookie': req.headers.cookie || ''
            }
        });
        console.log('Backend API Response Status:', response.status);
        console.log('Backend API Response Data:', JSON.stringify(response.data, null, 2));

        if (response.data && response.data.message) {
            // Calculate suggested time based on difficulty and question count
            const suggestedTime = calculateSuggestedTime(type, piece);
            
            return res.render("ai_modules/quiztor/index", {
                success: true,
                questions: response.data.message,
                suggestedTime: suggestedTime,
                showQuiz: true,
                formData: { subject, type, piece }
            });
        } else {
            throw new Error(response.data?.error || 'Backend API error');
        }

    } catch (error) {
        console.error('Question creation error:', error);
        
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.error || 'API isteği başarısız';
            
            return res.status(status).json({
                success: false,
                error: message
            });
        }

        return res.status(500).json({
            success: false,
            error: 'Soru oluşturulurken hata oluştu'
        });
    }
};

// Calculate suggested time based on difficulty and question count
function calculateSuggestedTime(type: string, piece: number): string {
    const baseTimePerQuestion = {
        'easy': 2,    // 2 minutes per easy question
        'normal': 3,  // 3 minutes per normal question
        'hard': 5     // 5 minutes per hard question
    };

    const totalMinutes = baseTimePerQuestion[type as keyof typeof baseTimePerQuestion] * piece;
    
    if (totalMinutes < 60) {
        return `${totalMinutes} dk`;
    } else {
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        return minutes > 0 ? `${hours} sa ${minutes} dk` : `${hours} sa`;
    }
}

// Get quiz statistics
export const getQuizStats = async (req: Request, res: Response) => {
    try {
        // For now, return empty stats - can be implemented with database later
        res.json({
            success: true,
            stats: {
                totalQuestions: 0,
                correctAnswers: 0,
                wrongAnswers: 0,
                emptyAnswers: 0
            }
        });
    } catch (error) {
        console.error('Stats fetch error:', error);
        res.status(500).json({
            success: false,
            error: 'İstatistikler alınırken hata oluştu'
        });
    }
};

// Save quiz results
export const saveQuizResults = async (req: Request, res: Response) => {
    try {
        const { results } = req.body;
        
        // For now, just return success - can be implemented with database later
        console.log('Quiz results:', results);
        
        res.json({
            success: true,
            message: 'Sonuçlar kaydedildi'
        });
    } catch (error) {
        console.error('Results save error:', error);
        res.status(500).json({
            success: false,
            error: 'Sonuçlar kaydedilirken hata oluştu'
        });
    }
};
