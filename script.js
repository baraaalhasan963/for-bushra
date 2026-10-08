/* ==========================================================================
   لبشرى من براء - سكريبت التفاعل والأنيميشن والموسيقى (JavaScript)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Canvas Background: Jasmine Petals & Floating Hearts ---
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const PARTICLE_COUNT = 38;

    class RomanticParticle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : -30;
            this.size = Math.random() * 14 + 10;
            this.speedY = Math.random() * 1.2 + 0.8;
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
            this.angle = Math.random() * 360;
            this.spin = (Math.random() - 0.5) * 1.5;
            this.opacity = Math.random() * 0.6 + 0.3;
            // Type: 0 = Jasmine Flower Petal, 1 = Romantic Heart
            this.type = Math.random() > 0.45 ? 'jasmine' : 'heart';
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.015) * 0.7 + this.speedX;
            this.angle += this.spin;

            if (this.y > height + 30 || this.x < -30 || this.x > width + 30) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;

            if (this.type === 'jasmine') {
                // Draw Damascene Jasmine Flower (White petals + golden center)
                ctx.fillStyle = '#fffdfa';
                for (let i = 0; i < 5; i++) {
                    ctx.save();
                    ctx.rotate(((i * 72) * Math.PI) / 180);
                    ctx.beginPath();
                    ctx.ellipse(0, -this.size * 0.4, this.size * 0.22, this.size * 0.45, 0, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.restore();
                }
                // Center glow
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.16, 0, Math.PI * 2);
                ctx.fillStyle = '#ffd166';
                ctx.fill();
            } else {
                // Draw Soft Glowing Heart
                ctx.fillStyle = '#ff758f';
                const s = this.size * 0.55;
                ctx.beginPath();
                ctx.moveTo(0, s * 0.3);
                ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.2, s * 0.6, 0, s * 1.3);
                ctx.bezierCurveTo(s * 1.2, s * 0.6, s, -s * 0.6, 0, s * 0.3);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new RomanticParticle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Touch / Click Ripple Hearts
    window.addEventListener('click', (e) => {
        // don't trigger if clicked on buttons
        if (e.target.closest('button, a, .envelope')) return;
        createBurstHearts(e.clientX, e.clientY, 5);
    });

    function createBurstHearts(x, y, count = 6) {
        for (let i = 0; i < count; i++) {
            const burst = new RomanticParticle();
            burst.x = x;
            burst.y = y;
            burst.type = 'heart';
            burst.size = Math.random() * 12 + 8;
            burst.speedY = (Math.random() - 0.7) * 3;
            burst.speedX = (Math.random() - 0.5) * 3;
            burst.opacity = 0.9;
            particles.push(burst);
            setTimeout(() => {
                const idx = particles.indexOf(burst);
                if (idx > -1) particles.splice(idx, 1);
            }, 1800);
        }
    }

    // --- 2. Web Audio API: Built-in Romantic Ambient Melody Synthesizer ---
    let audioCtx = null;
    let isPlaying = false;
    let melodyInterval = null;

    const chords = [
        [261.63, 329.63, 392.00, 523.25], // C Major 7 (C, E, G, C)
        [220.00, 261.63, 329.63, 440.00], // A Minor 7 (A, C, E, A)
        [174.61, 220.00, 261.63, 349.23], // F Major (F, A, C, F)
        [196.00, 246.94, 293.66, 392.00]  // G Major (G, B, D, G)
    ];
    let chordIdx = 0;
    let noteStep = 0;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtx = new AudioContext();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function playTone(freq, type = 'sine', duration = 1.2, volume = 0.08) {
        if (!audioCtx || audioCtx.state !== 'running') return;
        try {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            gain.gain.setValueAtTime(volume, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (err) {
            console.warn(err);
        }
    }

    function playChime() {
        initAudio();
        playTone(523.25, 'sine', 0.5, 0.1);
        setTimeout(() => playTone(659.25, 'sine', 0.6, 0.1), 120);
        setTimeout(() => playTone(783.99, 'sine', 0.8, 0.12), 240);
    }

    function playCelebrationFanfare() {
        initAudio();
        const fanfareNotes = [392, 523.25, 659.25, 783.99, 1046.5];
        fanfareNotes.forEach((note, idx) => {
            setTimeout(() => playTone(note, 'triangle', 0.8, 0.15), idx * 140);
        });
    }

    function startMusic() {
        initAudio();
        isPlaying = true;
        document.getElementById('audioControl').classList.add('audio-playing');
        document.getElementById('audioStatusText').textContent = 'اللحن شغّال 🎶';

        if (melodyInterval) clearInterval(melodyInterval);
        melodyInterval = setInterval(() => {
            const currentChord = chords[chordIdx];
            const noteFreq = currentChord[noteStep % currentChord.length];
            playTone(noteFreq, 'sine', 1.4, 0.05);

            // subtle high bell
            if (noteStep % 4 === 0) {
                playTone(noteFreq * 2, 'triangle', 1.8, 0.03);
            }

            noteStep++;
            if (noteStep >= 4) {
                noteStep = 0;
                chordIdx = (chordIdx + 1) % chords.length;
            }
        }, 550);
    }

    function stopMusic() {
        isPlaying = false;
        if (melodyInterval) clearInterval(melodyInterval);
        document.getElementById('audioControl').classList.remove('audio-playing');
        document.getElementById('audioStatusText').textContent = 'شغّلي اللحن 🎼';
    }

    const toggleAudioBtn = document.getElementById('toggleAudioBtn');
    toggleAudioBtn.addEventListener('click', () => {
        if (isPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    });

    // Auto-attempt start on first user interaction anywhere
    function autoStartAudioOnce() {
        if (!isPlaying) {
            startMusic();
        }
        window.removeEventListener('click', autoStartAudioOnce);
        window.removeEventListener('touchstart', autoStartAudioOnce);
    }
    window.addEventListener('click', autoStartAudioOnce, { once: true });
    window.addEventListener('touchstart', autoStartAudioOnce, { once: true });

    // --- 3. Stage Navigation & Stepper Logic ---
    let currentStep = 1;

    function goToStage(stepNumber) {
        // play gentle chime
        playChime();

        // Update Stepper Indicators
        document.querySelectorAll('.step-indicator').forEach(ind => {
            const s = parseInt(ind.getAttribute('data-step'));
            ind.classList.remove('active', 'completed');
            if (s === stepNumber) {
                ind.classList.add('active');
            } else if (s < stepNumber) {
                ind.classList.add('completed');
            }
        });

        // Toggle Sections
        document.querySelectorAll('.stage-section').forEach(sec => {
            sec.classList.remove('active');
        });

        const targetStage = document.getElementById(`stage${stepNumber}`);
        if (targetStage) {
            targetStage.classList.add('active');
            window.scrollTo({ top: targetStage.offsetTop - 40, behavior: 'smooth' });
        }

        currentStep = stepNumber;
    }

    // Generic Next / Prev Buttons
    document.querySelectorAll('.next-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.getAttribute('data-next'));
            goToStage(nextStep);
        });
    });

    document.querySelectorAll('.prev-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.getAttribute('data-prev'));
            goToStage(prevStep);
        });
    });

    // --- 4. STAGE 1: Envelope Opening Animation ---
    const envelope = document.getElementById('envelope');
    const openEnvelopeBtn = document.getElementById('openEnvelopeBtn');

    function openEnvelope() {
        envelope.classList.add('open');
        playChime();
        createBurstHearts(window.innerWidth / 2, window.innerHeight / 2, 10);
        setTimeout(() => {
            goToStage(2);
        }, 1200);
    }

    openEnvelopeBtn.addEventListener('click', openEnvelope);
    envelope.addEventListener('click', openEnvelope);

    // --- 5. STAGE 2: Interactive Heartbeat & Regret Meter ---
    const heartPulseBox = document.getElementById('heartPulseBox');
    const pulsingHeart = document.getElementById('pulsingHeart');
    const regretMeter = document.getElementById('regretMeter');
    const meterPercent = document.getElementById('meterPercent');
    const heartCaption = document.getElementById('heartCaption');

    let clickCount = 0;
    const syrianQuotes = [
        "لك والله دقات قلبي مو راضية تهدى بدونك!",
        "براء ندمان وعيونه ما عم تغفى 🥺",
        "دخيل قلبك وروقك يا ياسمينة الشام 🌸",
        "يا روحي إنتِ.. ما في شي بالكون بيسوى زعلك 🤍",
        "ضحكتك هي يلي بتضوي عتمة دنيتي ✨",
        "سامحيني وخلينا نرجع أحلى من أول وأكتر ❤️"
    ];

    heartPulseBox.addEventListener('click', () => {
        clickCount++;
        initAudio();
        playTone(180 + clickCount * 25, 'triangle', 0.25, 0.2);

        pulsingHeart.style.transform = `scale(${1.3 + (clickCount % 3) * 0.2})`;
        setTimeout(() => {
            pulsingHeart.style.transform = 'scale(1)';
        }, 200);

        const newPercent = 1000 + clickCount * 500;
        meterPercent.textContent = `${newPercent}%`;
        regretMeter.style.width = `${Math.min(100, 70 + clickCount * 6)}%`;

        const quote = syrianQuotes[clickCount % syrianQuotes.length];
        heartCaption.textContent = quote;
        heartCaption.style.color = '#ffd166';
    });

    // --- 6. STAGE 3: Promises 3D Flip Cards ---
    document.querySelectorAll('.promise-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
            playTone(440, 'sine', 0.3, 0.08);
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                card.classList.toggle('flipped');
                playTone(440, 'sine', 0.3, 0.08);
            }
        });
    });

    // --- 7. STAGE 4: Damascene Bouquet & Gift Picker ---
    const basketContent = document.getElementById('basketContent');
    const basketNote = document.getElementById('basketNote');
    const giftNotes = {
        jasmine: "ريحة الياسمين الشامي عطرها نقي متل قلبك يا بشرى 🌸",
        rose: "جوري أحمر بيحكي عن حب براء الكبير يلي ما بيهون عليه زعلك 🌹",
        chocolate: "شوكولا لتحلي قلبك وتروقي وننسى العتب والزعل 🍫",
        coffee: "فنجان قهوة مع روقان نقعد نشربو سوا ونتصافى ☕"
    };

    document.querySelectorAll('.gift-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const itemType = btn.getAttribute('data-item');
            const itemIcon = btn.getAttribute('data-icon');
            btn.classList.add('selected');

            // Add flower slot in basket
            const flowerSlot = document.createElement('span');
            flowerSlot.className = 'flower-slot';
            flowerSlot.textContent = itemIcon;
            basketContent.appendChild(flowerSlot);

            playTone(587.33, 'triangle', 0.4, 0.1);
            if (giftNotes[itemType]) {
                basketNote.textContent = giftNotes[itemType];
            }
        });
    });

    // --- 8. STAGE 5: The Playful Runaway Button & YES Decision ---
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const runawayHint = document.getElementById('runawayHint');
    const decisionArena = document.getElementById('decisionArena');

    const runawayResponses = [
        "ما رح خليكي تكبسي هون! 😜",
        "لك فداكي الكون سامحي براء! 🥺",
        "الزر هرب.. ما إلك إلا تسامحيني! ❤️",
        "والله بموت من الزعل لا تدوسي هون 🙈",
        "دخيل عينك وبراء عم يقلك آسف 🤍",
        "يلا كرمال براء هالمرة بس؟ 🥺",
        "الزر التاني ناطرك تكبسي عليه وبس!"
    ];
    let evadeCount = 0;

    function evadeNoButton(e) {
        e.preventDefault();
        evadeCount++;
        playTone(300, 'square', 0.1, 0.05);

        // Calculate safe random coordinates inside the arena
        const arenaRect = decisionArena.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();

        const maxX = Math.max(0, arenaRect.width - btnRect.width - 20);
        const maxY = Math.max(0, arenaRect.height - btnRect.height - 20);

        const randomX = (Math.random() - 0.5) * maxX;
        const randomY = (Math.random() - 0.5) * maxY;

        noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;

        const randomText = runawayResponses[evadeCount % runawayResponses.length];
        noBtn.innerHTML = `<span class="btn-icon">🏃‍♂️</span> ${randomText}`;
        runawayHint.textContent = "شفتي؟ حتى الموقع عم يقلك سامحي براء! كبسي عالزر الأخضر الحلو 🤍";

        // Make the YES button more prominent
        yesBtn.style.transform = `scale(${1 + Math.min(evadeCount * 0.05, 0.3)})`;
    }

    noBtn.addEventListener('mouseenter', evadeNoButton);
    noBtn.addEventListener('touchstart', evadeNoButton, { passive: false });
    noBtn.addEventListener('click', evadeNoButton);

    // When YES is clicked:
    yesBtn.addEventListener('click', () => {
        playCelebrationFanfare();
        triggerConfettiExplosion();
        goToStage(6);
    });

    // --- 9. STAGE 6: Celebration, Confetti & Actions ---
    function triggerConfettiExplosion() {
        for (let i = 0; i < 40; i++) {
            createBurstHearts(
                Math.random() * window.innerWidth,
                Math.random() * (window.innerHeight * 0.6),
                4
            );
        }
    }

    // Set today's date in Syrian Arabic format
    const dateText = document.getElementById('currentDateText');
    if (dateText) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateText.textContent = today.toLocaleDateString('ar-SY', options) + ' (وإلى الأبد)';
    }

    // WhatsApp Direct Message Pre-filled text
    const whatsappBtn = document.getElementById('whatsappShareBtn');
    if (whatsappBtn) {
        const message = "براء يا روحي.. شفت رسالتك واعتذارك بالموقع وسامحتك من كل قلبي ❤️ بس دير بالك عاد تزعلني مرة تانية يا دب! بحبك 🌸";
        whatsappBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    }

    // Restart Experience
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            envelope.classList.remove('open');
            noBtn.style.transform = 'translate(0, 0)';
            noBtn.innerHTML = '<span class="btn-icon">😤</span> لساتني زعلانة!';
            evadeCount = 0;
            goToStage(1);
        });
    }
});
