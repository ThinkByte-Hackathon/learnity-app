import { Request, Response } from 'express';

export const getAIModulesPage = (req: Request, res: Response) => {
    try {
        // AI modülleri bilgileri
        const modules = [
            {
                id: 'askaway',
                name: 'AskAway',
                description: 'Yapay zeka ile soru sorma ve cevap alma',
                icon: 'fas fa-question-circle',
                url: '/ai_modules/askaway',
                features: ['Metin ile soru sorma', 'Ses ile soru sorma', 'Görsel analizi', 'Hızlı işlemler']
            },
            {
                id: 'nothor',
                name: 'Nothor',
                description: 'AI destekli not alma ve düzenleme asistanı',
                icon: 'fas fa-edit',
                url: '/ai_modules/nothor',
                features: ['Sıfırdan not oluşturma', 'Mevcut notları tamamlama', 'Akıllı düzenleme', 'Otomatik formatla']
            },
            {
                id: 'quiztor',
                name: 'Quiztor',
                description: 'Yapay zeka ile soru üretme ve test çözme',
                icon: 'fas fa-brain',
                url: '/ai_modules/quiztor',
                features: ['Otomatik soru üretimi', 'Çoktan seçmeli testler', 'Zorluk seviyeleri', 'Detaylı sonuç analizi']
            }
        ];

        res.render('ai_modules/index', {
            title: 'AI Modülleri - Learnity',
            modules: modules,
            user: req.user || null
        });
    } catch (error) {
        console.error('AI Modülleri sayfası yüklenirken hata:', error);
        res.status(500).render('error', {
            title: 'Hata - Learnity',
            message: 'Sayfa yüklenirken bir hata oluştu',
            error: error
        });
    }
};
