document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 0. ПЕРЕМЕННЫЕ И СЛОВАРИ (ОБЪЯВЛЯЕМ СРАЗУ)
    // ==========================================
    const track = document.getElementById('sliderTrack');
    const dotsContainer = document.getElementById('sliderDots');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const toggleBtn = document.getElementById('toggle-chars');
    
    // Переменные для достижений и декора (вынесены наверх!)
    const contentContainer = document.getElementById('achievementsContent');
    const modal = document.getElementById('achievementModal');
    const closeModalBtn = document.getElementById('closeModal');
    const decorContainer = document.getElementById('decorContainer');

    // ==========================================
    // 1. ФУНКЦИИ (МОДАЛКА И ДЕКОР)
    // ==========================================
    
    // Открытие модального окна
    function openModal(ach) {
        if (!modal || !ach) return;
        document.getElementById('modalImg').src = `images/achievements/${ach.img}`;
        document.getElementById('modalTitle').textContent = ach.title;
        const catNames = { boss: 'Босс', item: 'Предмет', secret: 'Секрет', character: 'Персонаж' };
        document.getElementById('modalCategory').textContent = catNames[ach.cat] || ach.cat;
        document.getElementById('modalDesc').textContent = ach.desc;
        document.getElementById('modalUnlock').textContent = ach.unlock;
        modal.classList.add('active');
    }

    // Обновление иконок на свитке
    function updateDecorForCharacter(charName, isAlt = false) {
        if (!decorContainer) return;

        const decorBg = document.getElementById('decorBg');
        if (decorBg) {
            decorBg.src = isAlt ? 'images/decor_t.png' : 'images/decor.png';
        }
        
        decorContainer.querySelectorAll('.decor-btn').forEach(btn => btn.remove());

        const targetDict = isAlt ? altCharAchievements : normalCharAchievements;
        const achievementsList = targetDict[charName] || [];

        if (achievementsList.length === 0) return;

        const positions = [
            { top: '7%', left: '25%' }, { top: '27%', left: '27%' }, { top: '20%', left: '39%' },
            { top: '24%', left: '56%' }, { top: '18%', left: '73%' }, { top: '38%', left: '42%' },
            { top: '44%', left: '61%' }, { top: '42%', left: '16%' }, { top: '62%', left: '13%' },
            { top: '59%', left: '31%' }, { top: '65%', left: '47%' }
        ];

        achievementsList.forEach((item, index) => {
            if (typeof achievementsData === 'undefined') return; 
            
            // Ищем достижение по ID
            const ach = achievementsData.find(a => a.id === item.id);
            if (!ach) return;

            const pos = positions[index % positions.length];

            const btn = document.createElement('button');
            btn.classList.add('decor-btn');
            btn.setAttribute('data-achievement', ach.id);
            btn.style.top = pos.top;
            btn.style.left = pos.left;
            
            // Вставляем картинку из папки images/icons/
            btn.innerHTML = `<img src="images/icons/${item.icon}" alt="">`;
            
            btn.addEventListener('click', () => openModal(ach));

            // Эффект наведения (ищет красную версию в той же папке icons)
            btn.addEventListener('mouseenter', () => {
                const img = btn.querySelector('img');
                if (!img) return;
                const originalSrc = img.getAttribute('src');
                img.setAttribute('src', originalSrc.replace('.png', '_H.png'));
            });
            
            btn.addEventListener('mouseleave', () => {
                const img = btn.querySelector('img');
                if (!img) return;
                const currentSrc = img.getAttribute('src');
                img.setAttribute('src', currentSrc.replace('_H.png', '.png'));
            });

            decorContainer.appendChild(btn);
        });
    }

    // ==========================================
    // 2. СЛАЙДЕР ПЕРСОНАЖЕЙ
    // ==========================================
    if (track) {
        const normalChars = [
            { img: 'char1.png', name: 'Исаак' }, { img: 'char2.png', name: 'Магдалина' },
            { img: 'char3.png', name: 'Каин' }, { img: 'char4.png', name: 'Иуда' },
            { img: 'char5.png', name: '???' }, { img: 'char6.png', name: 'Ева' },
            { img: 'char7.png', name: 'Самсон' }, { img: 'char8.png', name: 'Азазель' },
            { img: 'char9.png', name: 'Лазарь' }, { img: 'char10.png', name: 'Эдем' },
            { img: 'char11.png', name: 'Лост' }, { img: 'char12.png', name: 'Лилит' },
            { img: 'char13.png', name: 'Кипер' }, { img: 'char14.png', name: 'Аполлион' },
            { img: 'char15.png', name: 'Забытый' }, { img: 'char16.png', name: 'Бетани' },
            { img: 'char17.png', name: 'Иаков и Исав' }
        ];

        const altChars = [
            { img: 'char1_t.png', name: 'Исаак' }, { img: 'char2_t.png', name: 'Магдалина' },
            { img: 'char3_t.png', name: 'Каин' }, { img: 'char4_t.png', name: 'Иуда' },
            { img: 'char5_t.png', name: '???' }, { img: 'char6_t.png', name: 'Ева' },
            { img: 'char7_t.png', name: 'Самсон' }, { img: 'char8_t.png', name: 'Азазель' },
            { img: 'char9_t.png', name: 'Лазарь' }, { img: 'char10_t.png', name: 'Эдем' },
            { img: 'char11_t.png', name: 'Лост' }, { img: 'char12_t.png', name: 'Лилит' },
            { img: 'char13_t.png', name: 'Кипер' }, { img: 'char14_t.png', name: 'Аполлион' },
            { img: 'char15_t.png', name: 'Забытый' }, { img: 'char16_t.png', name: 'Бетани' },
            { img: 'char17_t.png', name: 'Иаков и Исав' }
        ];

        let currentData = normalChars;
        let isAltMode = false;
        let total = currentData.length;
        let current = 0;

        function renderSlides(startIndex = 0) {
            track.innerHTML = '';
            dotsContainer.innerHTML = '';

            currentData.forEach((char, i) => {
                const slide = document.createElement('div');
                slide.classList.add('slide');
                slide.innerHTML = `
                    <div class="slide-oval-wrap">
                        <div class="slide-oval-glow"></div>
                        <img src="images/char/${char.img}" alt="${char.name}" class="slide-img">
                    </div>
                    <div class="name-wrap">
                        <h3>${char.name}</h3>
                    </div>
                `;
                track.appendChild(slide);

                const dot = document.createElement('button');
                dot.classList.add('dot');
                dot.addEventListener('click', () => goTo(i));
                dotsContainer.appendChild(dot);
            });

            total = currentData.length;
            goTo(startIndex < total ? startIndex : 0);
        }

        function goTo(index) {
            if (index < 0) index = total - 1;
            if (index >= total) index = 0;
            current = index;

            const slideWidth = track.querySelector('.slide').getBoundingClientRect().width;
            track.style.transform = `translateX(-${current * slideWidth}px)`;

            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === current);
            });

            // Теперь updateDecorForCharacter доступна, так как объявлена выше
            const currentCharName = currentData[current].name;
            updateDecorForCharacter(currentCharName, isAltMode);
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => goTo(current - 1));
            nextBtn.addEventListener('click', () => goTo(current + 1));
        }

        window.addEventListener('resize', () => goTo(current));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') goTo(current - 1);
            if (e.key === 'ArrowRight') goTo(current + 1);
        });

        let startX = 0;
        let isDragging = false;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        track.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            const diff = startX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? goTo(current + 1) : goTo(current - 1);
            }
        });

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                if (track.classList.contains('fading')) return;

                document.querySelectorAll('.slide-oval-wrap, .slide-oval-glow, .slide-img').forEach(el => {
                    el.style.opacity = '0';
                });

                isAltMode = !isAltMode;
                
                if (isAltMode) {
                    document.documentElement.style.setProperty('--glow-color', '#270708');
                } else {
                    document.documentElement.style.setProperty('--glow-color', '#7a262b');
                }

                setTimeout(() => {
                    currentData = isAltMode ? altChars : normalChars;
                    renderSlides(current);

                    setTimeout(() => {
                        document.querySelectorAll('.slide-oval-wrap, .slide-oval-glow, .slide-img').forEach(el => {
                            el.style.opacity = '1';
                        });
                    }, 50);
                }, 350);
            });
        }

        renderSlides(); // Запускает первый рендер и вызывает goTo(0)
    }

    // ==========================================
    // 3. СЕТКА ДОСТИЖЕНИЙ
    // ==========================================
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) modal.classList.remove('active'); });

    if (contentContainer && typeof achievementsData !== 'undefined') {
        const achievements = achievementsData;
        // Теперь фильтр — это массив выбранных категорий
        let currentFilters = []; 

        const bossBtn = document.getElementById('bossAccordionBtn');
        const bossList = document.getElementById('bossList');
        if (bossBtn && bossList) {
            bossBtn.addEventListener('click', () => {
                bossBtn.classList.toggle('open');
                bossList.classList.toggle('open');
            });
        }

        function renderAchievements() {
            contentContainer.innerHTML = '';
            
            let filtered = achievements;
            
            // Если выбраны фильтры, оставляем только те достижения, 
            // чья категория есть в списке выбранных (currentFilters)
            if (currentFilters.length > 0) {
                filtered = achievements.filter(a => currentFilters.includes(a.cat));
            }

            if (filtered.length === 0) {
                contentContainer.innerHTML = '<p style="color: #ded5aa; font-size: 1.2rem;">По этому фильтру достижений не найдено.</p>';
                return;
            }

            const groups = [
                { name: 'Rebirth', min: 1, max: 178 },
                { name: 'Afterbirth', min: 179, max: 276 },
                { name: 'Afterbirth +', min: 277, max: 403 },
                { name: 'Repentance', min: 404, max: 641 }
            ];

            groups.forEach(group => {
                const items = filtered.filter(ach => ach.id >= group.min && ach.id <= group.max);
                if (items.length === 0) return;

                const groupDiv = document.createElement('div');
                groupDiv.classList.add('achievement-group');

                const title = document.createElement('h3');
                title.classList.add('group-title');
                title.textContent = group.name;
                groupDiv.appendChild(title);

                const grid = document.createElement('div');
                grid.classList.add('achievements-grid');

                items.forEach(ach => {
                    const card = document.createElement('div');
                    card.classList.add('achievement-card');
                    card.innerHTML = `<img src="images/achievements/${ach.img}" alt="${ach.title}">`;
                    card.addEventListener('click', () => openModal(ach));
                    grid.appendChild(card);
                });

                groupDiv.appendChild(grid);
                contentContainer.appendChild(groupDiv);
            });
        }

                // Кнопка "Сбросить фильтр"
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) {
            allBtn.addEventListener('click', () => {
                // Очищаем все выбранные фильтры
                currentFilters = [];
                
                // Визуально снимаем выделение со всех кнопок
                document.querySelectorAll('.filter-btn, .boss-filter-btn').forEach(b => b.classList.remove('active'));
                allBtn.classList.add('active');
                
                renderAchievements();
            });
        }

        // Кнопки конкретных боссов
        const bossBtns = document.querySelectorAll('.boss-filter-btn');
        bossBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filterValue = btn.getAttribute('data-filter');

                // Если фильтр уже выбран — убираем его (повторный клик)
                if (currentFilters.includes(filterValue)) {
                    currentFilters = currentFilters.filter(f => f !== filterValue);
                    btn.classList.remove('active');
                } 
                // Если фильтра нет в списке — добавляем
                else {
                    currentFilters.push(filterValue);
                    btn.classList.add('active');
                }

                // Кнопка "Сбросить" больше не активна, так как мы выбрали конкретные фильтры
                if (allBtn) allBtn.classList.remove('active');

                // Если мы сняли последний фильтр, возвращаем кнопку "Сбросить" в активное состояние
                if (currentFilters.length === 0 && allBtn) {
                    allBtn.classList.add('active');
                }

                // Перерисовываем сетку
                renderAchievements();
            });
        });

        // Первичная отрисовка сетки
        renderAchievements();
    }

}); // Конец DOMContentLoaded