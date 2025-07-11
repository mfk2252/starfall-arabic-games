// وظائف الموقع الرئيسية

// فتح لعبة معينة
function openGame(gameId) {
    // في البيئة الحقيقية، سيتم فتح اللعبة في نافذة جديدة أو إعادة توجيه
    // هنا سنعرض رسالة تأكيد
    
    const gameNames = {
        'numbers': 'تطابق الأرقام',
        'english-letters': 'تطابق الحروف الإنجليزية',
        'arabic-letters': 'تطابق الحروف العربية',
        'arabic-words': 'الحروف والكلمات العربية',
        'english-words': 'الكلمات الإنجليزية',
        'images': 'تطابق الصور',
        'relations': 'التعرف على العلاقات',
        'opposites': 'المعكوسات',
        'puzzle-2': 'ترتيب الصور - قطعتان',
        'puzzle-4': 'ترتيب الصور - أربع قطع',
        'seasons': 'فصول السنة',
        'day-night': 'الليل والنهار'
    };
    
    // في التطبيق الحقيقي، سيتم فتح اللعبة
    // window.open(`games/${gameId}.html`, '_blank');
    
    // للعرض التوضيحي، سنعرض رسالة
    alert(`سيتم فتح لعبة: ${gameNames[gameId]}`);
    
    // يمكن إضافة المزيد من الوظائف هنا مثل:
    // - تتبع الإحصائيات
    // - حفظ التقدم
    // - تشغيل الأصوات
}

// تأثيرات تفاعلية للبطاقات
document.addEventListener('DOMContentLoaded', function() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        // تأثير النقر
        card.addEventListener('click', function() {
            const gameId = this.getAttribute('data-game');
            if (gameId) {
                openGame(gameId);
            }
        });
        
        // تأثير الحركة عند التمرير
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // تأثير التحميل التدريجي للبطاقات
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });
    
    gameCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// وظائف مساعدة
function playSound(soundType) {
    // في التطبيق الحقيقي، سيتم تشغيل الأصوات
    console.log(`تشغيل صوت: ${soundType}`);
}

function saveProgress(gameId, score) {
    // حفظ التقدم في التخزين المحلي
    const progress = JSON.parse(localStorage.getItem('starfall_progress') || '{}');
    progress[gameId] = {
        score: score,
        date: new Date().toISOString()
    };
    localStorage.setItem('starfall_progress', JSON.stringify(progress));
}

function getProgress(gameId) {
    // استرجاع التقدم المحفوظ
    const progress = JSON.parse(localStorage.getItem('starfall_progress') || '{}');
    return progress[gameId] || null;
}

