class AudioRecorderWorklet extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    
    if (input && input.length > 0) {
      const channelData = input[0];
      
      // Convert standard Float32 browser audio into raw 16-bit PCM for Gemini
      const pcm16 = new Int16Array(channelData.length);
      for (let i = 0; i < channelData.length; i++) {
        const s = Math.max(-1, Math.min(1, channelData[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      
      // Fire the processed audio chunk back to the main React thread
      this.port.postMessage(pcm16.buffer, [pcm16.buffer]);
    }
    
    // Return true to keep the processor alive
    return true;
  }
}

registerProcessor('audio-recorder-worklet', AudioRecorderWorklet);