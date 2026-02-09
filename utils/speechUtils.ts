export const speakWord = (text: string, rate: number = 0.8) => {
  if (!('speechSynthesis' in window)) {
    alert('Sorry, your browser does not support text-to-speech.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // Default to US English
  utterance.rate = rate; // Slightly slower for dictation
  utterance.pitch = 1.1; // Slightly higher pitch often sounds friendlier to kids
  utterance.volume = 1.0;

  // Try to find a good English voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(voice => 
    (voice.name.includes('Samantha') || voice.name.includes('Google US English')) && voice.lang.startsWith('en')
  ) || voices.find(voice => voice.lang.startsWith('en'));

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  window.speechSynthesis.speak(utterance);
};

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if (!('speechSynthesis' in window)) return [];
  return window.speechSynthesis.getVoices();
};