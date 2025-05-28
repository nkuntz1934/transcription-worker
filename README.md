# 🎙️ Audio Transcription Worker

Turn your audio files into text with this slick Cloudflare Worker powered by the OpenAI Whisper API! Upload MP3, M4A, or WAV files (up to 25 MB) through a drag-and-drop interface, and get transcriptions in a sleek dark-mode UI. Perfect for podcasters, journalists, or anyone needing quick audio-to-text conversion.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)

## ✨ Features
- **Drag-and-Drop Upload**: Effortlessly upload audio files.
- **OpenAI Whisper**: Top-notch transcription for MP3, M4A, WAV.
- **Dark-Mode UI**: Clean, responsive design.
- **Download Transcriptions**: Save results as text files.
- **Secure**: No audio storage, encrypted transfers.

## 🛠️ Prerequisites
- A Cloudflare account with Workers enabled.
- An OpenAI API key with Whisper API access.
- `wrangler` CLI for manual deployment.

## 🚀 Deployment

### Option 1: One-Click Deploy
Click the button to deploy instantly:

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/nkuntz1934/transcription-worker)

### Option 2: Manual Deployment
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/nkuntz1934/transcription-worker.git
   cd transcription-worker
   ```

2. **Set Up `wrangler.toml`**:
   Add this to `wrangler.toml`:
   ```toml
   name = "transcription-worker"
   main = "index.js"
   compatibility_date = "2025-05-27"
   workers_dev = true
   ```

3. **Install Wrangler**:
   Install the Wrangler CLI ([docs](https://developers.cloudflare.com/workers/wrangler/install-and-update/)):
   ```bash
   npm install -g wrangler
   ```

4. **Log In**:
   ```bash
   wrangler login
   ```

5. **Deploy**:
   ```bash
   wrangler deploy
   ```

6. **Test It**:
   Open `https://transcription-worker.your-subdomain.workers.dev` in your browser.

   ## 🔑 Set Up OpenAI API Key
1. **Grab Your Key**:
   - Head to [OpenAI](https://platform.openai.com/), log in, and generate an API key.
   - Ensure you’ve got credits for the Whisper API.

2. **Add to Cloudflare**:
   - **Dashboard**: Go to Workers & Pages > Your Worker > Settings > Variables > Add `OPENAI_API_KEY`.
   - **Wrangler CLI**:
     ```bash
     wrangler secret put OPENAI_API_KEY
     ```
     Paste your key when prompted.

## 🔄 How It Works
1. **Upload**: Drop an audio file into the web interface.
2. **Validation**: The Worker checks the file and preps it for transcription.
3. **Transcription**: File is sent to OpenAI’s Whisper API for processing.
4. **Results**: Transcription is displayed with a download link.

## 🔒 Security
- **API Key**: Safely stored as a Cloudflare secret.
- **No Storage**: Audio is processed in memory, not saved.
- **HTTPS**: All data transfers are encrypted.
- **Input Checks**: Validates audio files to block errors.
- **OpenAI**: Leverages OpenAI’s secure API infrastructure.

## ⚠️ Limitations
- **File Size**: Max 25 MB (OpenAI’s limit). Split larger files with Audacity or FFmpeg.
- **Memory**: Worker’s 128 MB limit may impact large files.
- **Formats**: Supports MP3, M4A, WAV. Convert others with `ffmpeg -i input.m4a output.mp3`.

## 🐛 Troubleshooting
- **API Key Issues**: Check `OPENAI_API_KEY` and OpenAI credits.
- **File Errors**: Verify MP3, M4A, or WAV format. Convert if needed.
- **Debug**: Run `wrangler tail` to view logs.

## 📄 License
MIT License. See [LICENSE](LICENSE).

## 👋 Get in Touch
Got questions? Open an issue or ping me at nicholas.kuntz@cloudflare.com.

---
*Made with ☕ for audio transcription fans!*
