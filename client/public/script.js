// script.js dosyası - Home Sayfası Dinamik Slider
console.log('Script file loaded!');

// DOM yüklendikten sonra çalıştır
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing slider...');
    
    // Element'leri bul
    const sliderTitle = document.getElementById('slider-title');
    const sliderDescription = document.getElementById('slider-description');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');

    // Element kontrolü
    console.log('Found elements:', {
        title: !!sliderTitle,
        description: !!sliderDescription,
        prevArrow: !!prevArrow,
        nextArrow: !!nextArrow
    });

    // Slider içeriği
    const slides = [
        {
            title: "Yapay Zekâ Destekli Eğitim Uygulaması Learnity ile Dijital Öğrenmede Yeni Nesil",
            description: "Bilginin sınırlarını zorlayın, öğrenme yolculuğunuzda size eşlik eden akıllı bir rehberle potansiyelinizi tam anlamıyla keşfedin."
        },
        {
            title: "Kişiye Özel Öğrenme Deneyimi",
            description: "Learnity, yapay zeka algoritmaları sayesinde öğrenme stilinize ve hızınıza uygun kişiselleştirilmiş içerikler sunar."
        },
        {
            title: "Sınavlara Hazırlıkta En Güçlü Yardımcınız",
            description: "TYT, AYT, LGS, KPSS ve daha fazlası... Learnity ile hedeflerinize emin adımlarla ulaşın, başarı artık çok yakın."
        }
    ];

    let currentSlideIndex = 0;

    // Slider güncelleme fonksiyonu
    function updateSlider() {
        console.log('Updating to slide:', currentSlideIndex);
        
        if (sliderTitle && sliderDescription) {
            const currentSlide = slides[currentSlideIndex];
            
            // Fade out
            sliderTitle.style.transition = 'opacity 0.3s ease';
            sliderDescription.style.transition = 'opacity 0.3s ease';
            sliderTitle.style.opacity = '0';
            sliderDescription.style.opacity = '0';
            
            // Update content after fade out
            setTimeout(() => {
                sliderTitle.textContent = currentSlide.title;
                sliderDescription.textContent = currentSlide.description;
                
                // Fade in
                sliderTitle.style.opacity = '1';
                sliderDescription.style.opacity = '1';
                
                console.log('Slide updated successfully');
            }, 300);
        } else {
            console.error('Slider elements not found!');
        }
    }

    // İlk slide'ı göster
    if (sliderTitle && sliderDescription) {
        updateSlider();
        console.log('Initial slide set');
    }

    // Previous arrow event
    if (prevArrow) {
        prevArrow.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Previous arrow clicked');
            currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
            updateSlider();
        });
        console.log('Previous arrow listener added');
    } else {
        console.error('Previous arrow not found!');
    }

    // Next arrow event
    if (nextArrow) {
        nextArrow.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Next arrow clicked');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            updateSlider();
        });
        console.log('Next arrow listener added');
    } else {
        console.error('Next arrow not found!');
    }

    // Auto-play slider
    console.log('Starting auto-play timer...');
    setInterval(function() {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        console.log('Auto-advancing to slide:', currentSlideIndex);
        updateSlider();
    }, 5000);
    
    console.log('Slider initialization complete!');
});
