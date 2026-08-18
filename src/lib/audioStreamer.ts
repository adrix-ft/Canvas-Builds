export class AudioStreamer {
  private context: AudioContext | null = null;
  private nextStartTime: number = 0;

  init() {
    // Gemini exclusively sends audio back at a 24kHz sample rate
    this.context = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    this.nextStartTime = this.context.currentTime;
  }

  playChunk(base64Audio: string) {
    if (!this.context) return;
    
    // 🔴 FIX: Force the browser to wake up the audio context if it suspended itself
    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    // 1. Decode the base64 string from Gemini into binary data
    const binaryString = atob(base64Audio);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    // 2. Convert the raw binary 16-bit PCM back into Float32 so the browser can play it
    const int16Array = new Int16Array(bytes.buffer);
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
    }

    // 3. Create an audio buffer for this specific chunk
    const audioBuffer = this.context.createBuffer(1, float32Array.length, 24000);
    audioBuffer.getChannelData(0).set(float32Array);
    
    const source = this.context.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.context.destination);
    
    // 4. Schedule the chunk to play exactly when the last one finishes (prevents stuttering)
    const playTime = Math.max(this.context.currentTime, this.nextStartTime);
    source.start(playTime);
    this.nextStartTime = playTime + audioBuffer.duration;
  }

  stop() {
    if (this.context) {
      this.context.close();
      this.context = null;
    }
  }
}