// Web Audio API kullanılarak oluşturulan ses efektleri
class SoundManager {
    constructor() {
        this.audioCtx = null;
        this.initialized = false;
        this.masterVolume = 0.3;
        this.sfxVolume = 0.5;
        this.musicVolume = 0.75;
        this.musicPlaying = false;
        this.musicOscillators = [];
        this.musicGain = null;
        this.muted = false;
    }

    init() {
        if (this.initialized) return;
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            this.masterGainNode = this.audioCtx.createGain();
            this.masterGainNode.gain.value = this.masterVolume;
            this.masterGainNode.connect(this.audioCtx.destination);
            this.initialized = true;
        } catch (e) {
            console.warn('Web Audio API desteklenmiyor:', e);
        }
    }

    // Ses açma/kapatma
    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGainNode) {
            this.masterGainNode.gain.value = this.muted ? 0 : this.masterVolume;
        }
        return this.muted;
    }
    
    playShoot() { // Oyuncunun ateş sesi.
        if (!this.initialized || this.muted) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.1);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.1);

        gain.gain.setValueAtTime(this.sfxVolume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGainNode);

        osc.start(now);
        osc.stop(now + 0.12);
    }
    
    playEnemyShoot() { // Düşman ateş etme sesi
        if (!this.initialized || this.muted) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

        gain.gain.setValueAtTime(this.sfxVolume * 0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGainNode);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Düşmana vurduğumuzda çıkan ses efekti
    playHit() {
        if (!this.initialized || this.muted) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;
        const bufferSize = ctx.sampleRate * 0.08;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.sfxVolume * 0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1500;
        filter.Q.value = 2;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGainNode);

        noise.start(now);
    }

    // Düşmanın bizi vurdğunda çıkan ses efekti
    playPlayerHit() {
        if (!this.initialized || this.muted) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.2);

        gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGainNode);

        osc.start(now);
        osc.stop(now + 0.25);

        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(this.sfxVolume * 0.2, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        noise.connect(noiseGain);
        noiseGain.connect(this.masterGainNode);

        noise.start(now);
    }

    // Düşmanı patlatma
    playExplosion() {
        if (!this.initialized || this.muted) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;
        const bufferSize = ctx.sampleRate * 0.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2.5);
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGainNode);

        noise.start(now);

        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.3);

        oscGain.gain.setValueAtTime(this.sfxVolume * 0.4, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(oscGain);
        oscGain.connect(this.masterGainNode);

        osc.start(now);
        osc.stop(now + 0.35);
    }

    // Güçlenme sesi efekti
    playPowerUp() {
        if (!this.initialized || this.muted) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // Yapay zekaya yardımıyla oluşturulan notalar (Harfler notayı sayılar kaçıncı oktavda olduğunu gösterir.): C4, E4, G4, C5, E5
        const duration = 0.08;

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.value = freq;

            const startTime = now + i * duration;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.4, startTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gain);
            gain.connect(this.masterGainNode);

            osc.start(startTime);
            osc.stop(startTime + duration);
        });

        // Parıltı efekti
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3) * 0.1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(this.sfxVolume * 0.1, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 3000;

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.masterGainNode);

        noise.start(now);
    }

    // Seviye atlama ses efekti
    playLevelUp() {
        if (!this.initialized || this.muted) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const notes = [523.25, 659.25, 783.99, 1046.50]; // Burada yazılan notalar: C5, E5, G5, C6
        const duration = 0.12;

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = now + i * duration;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.3, startTime + 0.02);
            gain.gain.setValueAtTime(this.sfxVolume * 0.3, startTime + duration - 0.02);
            gain.gain.linearRampToValueAtTime(0.001, startTime + duration + 0.1);

            osc.connect(gain);
            gain.connect(this.masterGainNode);

            osc.start(startTime);
            osc.stop(startTime + duration + 0.1);
        });

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'triangle';
        osc2.frequency.value = 1046.50;
        const finalStart = now + notes.length * duration;
        gain2.gain.setValueAtTime(0, finalStart);
        gain2.gain.linearRampToValueAtTime(this.sfxVolume * 0.25, finalStart + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.001, finalStart + 0.5);
        osc2.connect(gain2);
        gain2.connect(this.masterGainNode);
        osc2.start(finalStart);
        osc2.stop(finalStart + 0.5);
    }

    // Meşhur Game Over ses efekti
    playGameOver() {
        if (!this.initialized || this.muted) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        const notes = [440, 392, 349.23, 261.63]; // Notalar: A4, G4, F4, C4
        const duration = 0.3;

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = now + i * duration;
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.35, startTime + 0.03);
            gain.gain.setValueAtTime(this.sfxVolume * 0.35, startTime + duration * 0.7);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

            osc.connect(gain);
            gain.connect(this.masterGainNode);

            osc.start(startTime);
            osc.stop(startTime + duration + 0.05);
        });

        const bufferSize = ctx.sampleRate * 0.8;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 4);
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(this.sfxVolume * 0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGainNode);

        noise.start(now);
    }

    // Arka planda çalacak savaş müziği
    startMusic() {
        if (!this.initialized || this.musicPlaying) return;
        this.musicPlaying = true;

        const ctx = this.audioCtx;

        this.musicGain = ctx.createGain();
        this.musicGain.gain.value = this.musicVolume;
        this.musicGain.connect(this.masterGainNode);

        this._playMusicLoop();
    }

    _playMusicLoop() {
        if (!this.musicPlaying || !this.initialized) return;

        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        // Savaş Davul ritmi
        const bassNotes = [65.41, 65.41, 82.41, 65.41, 73.42, 65.41, 82.41, 98]; // ikinci oktav DO notası (C2) 
        const beatDuration = 0.25;
        const barLength = bassNotes.length * beatDuration;

        bassNotes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.value = freq;

            const t = now + i * beatDuration;
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(this.musicVolume * 0.6, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, t + beatDuration * 0.8);

            osc.connect(gain);
            gain.connect(this.musicGain);

            osc.start(t);
            osc.stop(t + beatDuration);

            this.musicOscillators.push(osc);
        });

        for (let i = 0; i < bassNotes.length; i += 2) {
            const bufferSize = ctx.sampleRate * 0.1;
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let j = 0; j < bufferSize; j++) {
                data[j] = Math.sin(j * 0.05 * Math.pow(1 - j / bufferSize, 4)) * Math.pow(1 - j / bufferSize, 3);
            }

            const noise = ctx.createBufferSource();
            noise.buffer = buffer;

            const gain = ctx.createGain();
            gain.gain.value = this.musicVolume * 0.4;

            noise.connect(gain);
            gain.connect(this.musicGain);

            noise.start(now + i * beatDuration);
        }

        for (let i = 0; i < bassNotes.length; i++) {
            if (i % 2 === 1) {
                const bufferSize = ctx.sampleRate * 0.03;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let j = 0; j < bufferSize; j++) {
                    data[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / bufferSize, 6);
                }

                const noise = ctx.createBufferSource();
                noise.buffer = buffer;

                const gain = ctx.createGain();
                gain.gain.value = this.musicVolume * 0.15;

                const filter = ctx.createBiquadFilter();
                filter.type = 'highpass';
                filter.frequency.value = 8000;

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(this.musicGain);

                noise.start(now + i * beatDuration);
            }
        }

        // Döngüleştirme
        this._musicTimeout = setTimeout(() => {
            this._playMusicLoop();
        }, barLength * 1000);
    }

    stopMusic() {
        this.musicPlaying = false;
        if (this._musicTimeout) {
            clearTimeout(this._musicTimeout);
        }
        this.musicOscillators.forEach(osc => {
            try { osc.stop(); } catch (e) { }
        });
        this.musicOscillators = [];
    }

    // Yeniden başlatma
    restartMusic() {
        this.stopMusic();
        setTimeout(() => this.startMusic(), 100);
    }
}

const soundManager = new SoundManager();