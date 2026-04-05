const state = {
            quizComplete: false,
            rewardsFound: 0,
            requiredRewards: 2,
            chaseActive: false,
            attempts: 0,
            maxAttempts: 20
        };

        const quizData = [
            { q: "Anong weird kong ginagawa sa iced drinks?", a: ["Tinutunaw yung yelo", "Hinahaluan ng mainit", "Kinakain yung yelo", "Wala lang"], correct: 2 },
            { q: "Saan tayo unang nag-date?", a: ["Sa Puso mo", "Christina's Cafe", "Coffee Shop", "Mixue"], correct: 1 },
            { q: "Favorite kong prutas?", a: ["Pakwan", "Strawberry", "Mangga", "Lahat ng nabanggit"], correct: 0 },
            { q: "Fastfood na madalas nagkakasundo para kainan?", a: ["Jollibee", "Mcdo", "Kfc", "Popeyes"], correct: 3 },
            { q: "Favorite color", a: ["Peach", "Brown", "Sky Blue", "Lahat ng nabanggit"], correct: 3 }
        ];
        let currentQ = 0;

        function initQuiz() {
            const qText = document.getElementById('question-text');
            const btnContainer = document.getElementById('answer-buttons');
            const data = quizData[currentQ];

            qText.innerText = data.q;
            btnContainer.innerHTML = '';

            data.a.forEach((choice, index) => {
                const btn = document.createElement('button');
                btn.innerText = choice;
                btn.className = 'tab-btn';
                btn.onclick = () => {
                    if (index === data.correct) {
                        currentQ++;
                        if (currentQ < quizData.length) initQuiz();
                        else completeQuiz();
                    } else {
                        updateStatus("Mali! Hays, Ano ba yan 😏");
                    }
                };
                btnContainer.appendChild(btn);
            });
        }

        function completeQuiz() {
            state.quizComplete = true;
            document.getElementById('quiz-section').style.display = 'none';
            document.getElementById('game-content').style.display = 'block';
            updateStatus("Stage 2: Find the 2 hidden rewards in the box! 🔍");
        }

        function findReward(el, msg) {
            if (el.classList.contains('found')) return;
            el.classList.add('found');
            state.rewardsFound++;
            showSecret(msg);
            if (state.rewardsFound === state.requiredRewards) startChasingStage();
            else updateStatus(`Found ${state.rewardsFound}/${state.requiredRewards}. Keep looking!`);
        }

        function startChasingStage() {
            state.chaseActive = true;
            updateStatus("FINAL STAGE: The stickers are cheering! CATCH MY HEART! ❤️");
            const squad = document.getElementById('cheer-squad');
            [document.getElementById('s1'), document.getElementById('s2')].forEach(s => {
                s.style.position = "static";
                s.style.opacity = "1";
                s.classList.add('cheering');
                squad.appendChild(s);
            });
            const boundary = document.getElementById('game-boundary');
            const heart = document.createElement('div');
            heart.id = 'heart';
            heart.innerHTML = '❤️';
            heart.style.top = "45%"; heart.style.left = "45%";
            heart.onmouseover = moveHeart;
            heart.onclick = revealPrize;
            boundary.appendChild(heart);
        }

        function moveHeart() {
            if (!state.chaseActive) return;
            const heart = document.getElementById('heart');
            if (state.attempts >= state.maxAttempts) {
                heart.style.transition = "0.5s";
                heart.innerHTML = "😏";
                updateStatus("Hiningal tuloy... bagal mo kasi 😏");
                return;
            }
            const box = document.getElementById('game-boundary');
            const x = Math.max(0, Math.random() * (box.clientWidth - 70));
            const y = Math.max(0, Math.random() * (box.clientHeight - 70));
            heart.style.left = `${x}px`;
            heart.style.top = `${y}px`;
            state.attempts++;
            if (state.attempts === 5) updateStatus("Ano bayan, Mabagal 🤪");
            else if (state.attempts === 8) updateStatus("Wala to guys, mahina HAHAHAHA 😂");
            else if (state.attempts === 13) updateStatus("Konting push na lang! 😂");
            else if (state.attempts === 16) updateStatus("Hihingalin na yung puso ko niyan 😂");
        }

        function revealPrize() {
            document.getElementById('game-content').style.display = 'none';
            document.getElementById('status-message').style.display = 'none';
            document.getElementById('game-title').innerText = "Mission Accomplished";
            document.getElementById('prize-reveal').style.display = 'block';
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }

        function updateStatus(msg) { document.getElementById('status-message').innerText = msg; }
        function showSecret(msg) { document.getElementById('secret-text').innerText = msg; document.getElementById('secret-overlay').style.display = 'flex'; }
        function closeSecret() { document.getElementById('secret-overlay').style.display = 'none'; }
        
        // I-handle ang dropdown buttons papunta sa gallery
        function goToGallery(type) {
            window.location.href = `gallery.html?tab=${type}`;
        }

        initQuiz();