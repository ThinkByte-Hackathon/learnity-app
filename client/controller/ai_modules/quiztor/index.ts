import { Request, Response } from "express";
import axios from "axios";
import { serverUrl } from "../../../../config";

const getQuiztorPage = async (
    req: Request,
    res: Response
) => {
    try {
        // Gemini Soru Oluşturucu sayfasını render et
        return res.render("ai_modules/quiztor/index");
    } catch (error) {
        console.error("Quiztor page error:", error);
        return res.status(500).render("error", { 
            message: "Gemini Soru Oluşturucu sayfası yüklenirken bir hata oluştu." 
        });
    }
}

const createQuestion = async (
    req: Request,
    res: Response
) => {
    // Değişkenleri function scope'unda tanımla
    let subject: string = '';
    let type: string = '';
    let piece: number = 0;
    
    try {
        ({ subject, type, piece } = req.body);
        
        // Giriş verilerini kontrol et
        if (!subject || !type || !piece) {
            return res.status(400).json({
                message: "Konu, zorluk seviyesi ve soru sayısı gereklidir.",
                error: true
            });
        }

        // Type değerini API formatına çevir
        const typeMapping: { [key: string]: string } = {
            'easy': 'easy',
            'normal': 'normal', 
            'hard': 'hard',
            'extreme': 'extreme'
        };

        const apiType = typeMapping[type] || 'normal';

        // Gemini API'ye istek gönder
        const apiResponse = await axios.post(`${serverUrl}/gemini/createQuestion`, {
            subject: subject,
            type: apiType,
            piece: piece
        }, {
            headers: {
                "Cookie": req.headers.cookie || "",
                'Content-Type': 'application/json',
            }
        });

        // API yanıtını kontrol et
        console.log("API Response:", apiResponse.data);
        
        if (apiResponse.data && apiResponse.data.message) {
            // Soruları parse et
            const parsedData = parseQuestionsFromMessage(apiResponse.data.message);

            return res.json({
                message: "Sorular başarıyla oluşturuldu",
                data: {
                    message: apiResponse.data.message,
                    questions: parsedData.questions,
                    answers: parsedData.answers,
                    subject: subject,
                    type: type,
                    piece: piece
                }
            });
        } else {
            console.log("else durumuna girdi");

            console.log("API response beklenmeyen format, mock response döndürülüyor");
            const mockMessage = generateMockQuestions(subject, type, piece);
            const parsedData = parseQuestionsFromMessage(mockMessage);
            
            return res.json({
                message: "Sorular başarıyla oluşturuldu (mock)",
                data: {
                    message: mockMessage,
                    questions: parsedData.questions,
                    answers: parsedData.answers,
                    subject: subject,
                    type: type,
                    piece: piece
                }
            });
        }

    } catch (error) {
        console.error("Question creation error:", error);
        
        let errorMessage = "Soru oluşturulurken bir hata oluştu.";
        
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                console.log("API authentication hatası - Mock response döndürülüyor");
                const mockMessage = generateMockQuestions(subject, type, piece);
                const parsedData = parseQuestionsFromMessage(mockMessage);
                
                return res.json({
                    message: "Sorular başarıyla oluşturuldu (mock - auth error)",
                    data: {
                        message: mockMessage,
                        questions: parsedData.questions,
                        answers: parsedData.answers,
                        subject: subject,
                        type: type,
                        piece: piece
                    }
                });
            } else if (error.response?.status === 404) {
                errorMessage = "AI servisi şu anda kullanılamıyor.";
            } else if (error.response?.status === 429) {
                errorMessage = "Çok fazla istek gönderildi. Lütfen biraz bekleyin.";
            } else if (error.response?.status && error.response.status >= 500) {
                console.log("API sunucu hatası - Mock response döndürülüyor");
                const mockMessage = generateMockQuestions(subject, type, piece);
                const parsedData = parseQuestionsFromMessage(mockMessage);
                
                return res.json({
                    message: "Sorular başarıyla oluşturuldu (mock - server error)",
                    data: {
                        message: mockMessage,
                        questions: parsedData.questions,
                        answers: parsedData.answers,
                        subject: subject,
                        type: type,
                        piece: piece
                    }
                });
            }
        }
        
        return res.status(500).json({
            message: errorMessage,
            error: true
        });
    }
}

// Soruları parse eden yardımcı fonksiyon
function parseQuestionsFromMessage(message: string) {
    const questions: any[] = [];
    const answers: string[] = [];
    
    // Soruları ayır (markdown formatından)
    const questionBlocks = message.split(/\*\*Soru \d+.*?\*\*/).filter(block => block.trim());
    
    // Cevap anahtarı iki farklı formatta olabilir:
    let answerLetters: string[] = [];
    
    // 1. Format: Doğru cevaplar sırasıyla ...
    const match1 = message.match(/Doğru cevaplar.*?([a-e](,\s*[a-e])*)/i);
    if (match1) {
        answerLetters = match1[1].split(',').map(s => s.trim());
    }
    // 2. Format: Cevap Anahtarı: Soru 1:  c) ...
    else {
        const match2 = message.match(/Cevap Anahtarı:(.|\n)+/i);
        if (match2) {
            const lines = match2[0].split('\n').filter(l => l.match(/Soru \d+:/));
            lines.forEach(line => {
                const m = line.match(/Soru \d+:\s*([a-e])\)/i);
                if (m) {
                    answerLetters.push(m[1]);
                } else {
                    const m2 = line.match(/Soru \d+:\s*([a-e])/i);
                    if (m2) answerLetters.push(m2[1]);
                }
            });
        }
    }
    
    questionBlocks.forEach((block, index) => {
        if (block.trim()) {
            const lines = block.split('\n').filter(line => line.trim());
            
            let questionText = '';
            let options: string[] = [];
            let correctAnswer = '';
            
            lines.forEach(line => {
                line = line.trim();
                if (line && !line.startsWith('a)') && !line.startsWith('b)') && 
                    !line.startsWith('c)') && !line.startsWith('d)') && 
                    !line.startsWith('e)') && !line.includes('Doğru cevaplar') && !line.includes('Cevap Anahtarı')) {
                    questionText += line + ' ';
                } else if (line.match(/^[a-e]\)/)) {
                    options.push(line);
                }
            });
            
            if (answerLetters && answerLetters[index]) {
                correctAnswer = answerLetters[index];
            }
            
            if (questionText && options.length >= 4) {
                questions.push({
                    id: index + 1,
                    text: questionText.trim(),
                    options: options
                });
                answers.push(correctAnswer);
            }
        }
    });
    
    return { questions, answers };
}

// Mock questions generator - API format ile uyumlu
function generateMockQuestions(subject: string, type: string, piece: number): string {
    const difficultyLevels = {
        'easy': 'Isınma (Kolay)',
        'normal': 'Antrenman (Orta)',
        'hard': 'Lig (Zor)',
        'extreme': 'Şampiyonlar Ligi (Aşırı Zor)'
    };

    const levelText = difficultyLevels[type as keyof typeof difficultyLevels] || 'Antrenman (Orta)';

    let questionsText = '';
    let correctAnswers = [];
    
    for (let i = 1; i <= piece; i++) {
        const correctAnswer = ['a', 'b', 'c', 'd', 'e'][Math.floor(Math.random() * 5)];
        correctAnswers.push(correctAnswer);
        
        questionsText += `**Soru ${i} (${levelText}):**\n\n`;
        questionsText += `${subject} konusu ile ilgili ${i}. soru metni burada yer alacak. Bu soru ${levelText.toLowerCase()} seviyede hazırlanmıştır.\n\n`;
        questionsText += `a) Birinci seçenek\n`;
        questionsText += `b) İkinci seçenek\n`;
        questionsText += `c) Üçüncü seçenek\n`;
        questionsText += `d) Dördüncü seçenek\n`;
        questionsText += `e) Beşinci seçenek\n\n\n`;
    }

    questionsText += `Doğru cevaplar sırasıyla ${correctAnswers.join(', ')}'dir.\n`;
    
    return questionsText;
}

export { getQuiztorPage, createQuestion };
export default { getQuiztorPage, createQuestion }; 