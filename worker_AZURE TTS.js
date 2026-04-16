const AZURE_REGION = 'eastasia';
const TTS_VOICE = 'zh-TW-YunJheNeural';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS });
    }

    const url = new URL(request.url);

    if (url.pathname === '/gemini') {
      const body = await request.json();
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/stt') {
      const audioData = await request.arrayBuffer();
      const res = await fetch(
        `https://${AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=zh-TW`,
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': env.AZURE_SPEECH_KEY,
            'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
          },
          body: audioData,
        }
      );
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    if (url.pathname === '/tts') {
      const { text } = await request.json();

      const ssml = '<speak version=\'1.0\' xml:lang=\'zh-TW\'><voice name=\'zh-TW-YunJheNeural\'>' + text + '</voice></speak>';

      const res = await fetch(
        `https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
        {
          method: 'POST',
          headers: {
            'Ocp-Apim-Subscription-Key': env.AZURE_SPEECH_KEY,
            'Content-Type': 'application/ssml+xml; charset=utf-8',
            'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
            'User-Agent': 'NMTHChatbot',
          },
          body: ssml,
        }
      );

      const audioBuffer = await res.arrayBuffer();
      return new Response(audioBuffer, {
        status: res.status,
        headers: {
          ...CORS,
          'Content-Type': 'audio/mpeg',
          'Content-Length': audioBuffer.byteLength.toString(),
        },
      });
    }

    return new Response('Not found', { status: 404 });
  },
};