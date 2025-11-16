class AudioEngine {
  constructor(audioElement) {
    this.audioElement = audioElement;
    this.audioContext = null;
    this.source = null;
    this.effectNode = null;
    this.output = null;
    this.activeEffects = [];
  }

  _ensureContext() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.source = this.audioContext.createMediaElementSource(
        this.audioElement
      );
      this.effectNode = this.audioContext.createGain();
      this.output = this.audioContext.destination;
      this.source.connect(this.effectNode).connect(this.output);
    }
  }

  applyCurse(curseName) {
    this._ensureContext();
    let newNode;

    switch (curseName) {
      case "Low Pass Filter":
        newNode = this.audioContext.createBiquadFilter();
        newNode.type = "lowpass";
        newNode.frequency.value = 1000;
        break;

      case "High Pass Filter":
        newNode = this.audioContext.createBiquadFilter();
        newNode.type = "highpass";
        newNode.frequency.value = 1000;
        break;

      case "Distortion":
        newNode = this.audioContext.createWaveShaper();
        newNode.curve = this.makeDistortionCurve(200);
        break;

      case "Slow Down":
        this.audioElement.playbackRate = 0.5;
        return;

      case "Speed Up":
        this.audioElement.playbackRate = 2.0;
        return;

      case "Bitcrush":
        const bufferSize = 4096;
        const crushFactor = 8; 

        const crusher = this.audioContext.createScriptProcessor(
          bufferSize,
          1,
          1
        );

        let lastSample = 0;
        let step = 0;

        crusher.onaudioprocess = (e) => {
          const input = e.inputBuffer.getChannelData(0);
          const output = e.outputBuffer.getChannelData(0);

          for (let i = 0; i < input.length; i++) {
            if (step % crushFactor === 0) {
              lastSample = input[i];
            }
            output[i] = lastSample;
            step++;
          }
        };
        newNode = crusher;
        break;

      case "Reverb":
        newNode = this.audioContext.createConvolver();

        // Generate impulse response (fake reverb)
        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * 2.5; // 2.5 seconds of reverb
        const impulse = this.audioContext.createBuffer(2, length, sampleRate);

        for (let channel = 0; channel < 2; channel++) {
          const channelData = impulse.getChannelData(channel);
          for (let i = 0; i < length; i++) {
            channelData[i] =
              (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2);
          }
        }

        newNode.buffer = impulse;
        break;

      case "Chop Up":
        const chopRate = 0.5; // cut every 0.5 seconds
        const chopGain = this.audioContext.createGain();

        // Oscillate between 0 (silent) and 1 (audible)
        const lfo = this.audioContext.createOscillator();
        lfo.frequency.value = 1 / chopRate; // Hz
        lfo.type = "square"; // square waves! I love square waves!

        // Offset so it goes 0 to 1 instead of -1 to 1
        const offset = this.audioContext.createConstantSource();
        offset.offset.value = 0.5;
        offset.start();

        lfo.connect(chopGain.gain);
        offset.connect(chopGain.gain);
        chopGain.gain.value = 0; // Start at 0, let LFO control it

        lfo.start();

        newNode = chopGain;
        break;

      case "Echo":
        const delayTime = 0.3; // 300ms delay
        const feedbackAmount = 0.5; // how much echo repeats (0-1)

        const delayNode = this.audioContext.createDelay();
        delayNode.delayTime.value = delayTime;

        const feedback = this.audioContext.createGain();
        feedback.gain.value = feedbackAmount;

        const wetGain = this.audioContext.createGain();
        wetGain.gain.value = 0.6; // mix level

        delayNode.connect(feedback);
        feedback.connect(delayNode); 
        delayNode.connect(wetGain);

        newNode = delayNode;
        break;

      default:
        return;
    }

    // Connect new effect in series - used to stack effects!
    if (this.activeEffects.length === 0) {
      this.source.disconnect();
      this.source.connect(newNode).connect(this.output);
    } else {
      const lastNode = this.activeEffects[this.activeEffects.length - 1].node;
      lastNode.disconnect();
      lastNode.connect(newNode).connect(this.output);
    }

    this.activeEffects.push({ curseName, node: newNode });
  }

  makeDistortionCurve(amount = 50) {
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;

    for (let i = 0; i < n_samples; i++) {
      const x = (i * 2) / n_samples - 1;
      curve[i] =
        ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }

    return curve;
  }

  clearCurses() {
    if (!this.audioContext) return;
    this.audioElement.playbackRate = 1;

    this.activeEffects.forEach(({ node }) => {
      try {
        node.disconnect();
      } catch (_) {}
    });

    this.activeEffects = [];

    this.source.disconnect();
    this.source.connect(this.effectNode).connect(this.output);
  }
}

export default AudioEngine;
