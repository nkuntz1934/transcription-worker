export default {
  async fetch(request, env, ctx) {
    if (request.method === "GET") {
      return new Response(HTML_PAGE, {
        headers: { "Content-Type": "text/html;charset=UTF-8" },
      });
    } else if (request.method === "POST") {
      try {
        const contentType = request.headers.get("content-type") || "";
        let audioData;
        if (contentType.includes("multipart/form-data")) {
          const formData = await request.formData();
          audioData = formData.get("audio");
          if (!audioData) {
            throw new Error("Missing 'audio' file in form data.");
          }
        } else {
          const buffer = await request.arrayBuffer();
          audioData = new Blob([buffer], { type: "audio/mpeg" });
        }

        console.log("Audio file parsed successfully.");

        // Build the FormData payload for the transcription API.
        const transcriptionPayload = new FormData();
        // Use the file's actual name if available.
        const filename = (audioData && audioData.name) ? audioData.name : "audio.mp3";
        transcriptionPayload.append("file", audioData, filename);
        transcriptionPayload.append("model", "whisper-1");

        console.log("Sending transcription request to OpenAI.");
        const apiResponse = await fetch("https://api.openai.com/v1/audio/transcriptions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENAI_API_KEY}`,
          },
          body: transcriptionPayload,
        });

        const result = await apiResponse.json();

        if (!apiResponse.ok) {
          console.error("Error from transcription API:", result);
          return new Response(JSON.stringify(result, null, 2), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const transcriptionText = result.text || "No transcription found.";
        console.log("Transcription received:", transcriptionText);

        // Build the output HTML page (dark mode) to display the transcription.
        const outputHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Transcription Result</title>
  <style>
    body {
      background-color: #1a1a1a;
      color: #ffffff;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    h1 {
      font-size: 2.5em;
      margin-bottom: 20px;
    }
    pre {
      background-color: #2a2a2a;
      padding: 20px;
      border-radius: 8px;
      max-width: 600px;
      width: 100%;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    a, button {
      display: inline-block;
      padding: 10px 20px;
      margin: 10px;
      background-color: #4a4a4a;
      color: #ffffff;
      text-decoration: none;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
    }
    a:hover, button:hover {
      background-color: #5a5a5a;
    }
  </style>
</head>
<body>
  <h1>Transcription</h1>
  <pre>${transcriptionText}</pre>
  <a href="data:text/plain;charset=utf-8,${encodeURIComponent(transcriptionText)}" download="transcription.txt">Download Transcription</a>
  <a href="/">Transcribe another file</a>
</body>
</html>
        `;
        return new Response(outputHtml, {
          headers: { "Content-Type": "text/html;charset=UTF-8" },
        });
      } catch (err) {
        console.error("Error processing POST request:", err);
        return new Response("Error processing request: " + err.message, { status: 500 });
      }
    } else {
      return new Response("Method not allowed", { status: 405 });
    }
  },
};

// Dark-mode HTML page served on GET requests.
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Audio Transcription</title>
  <style>
    body {
      background-color: #1a1a1a;
      color: #ffffff;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    h1 {
      font-size: 2.5em;
      margin-bottom: 20px;
    }
    #dropZone {
      border: 2px dashed #4a4a4a;
      border-radius: 10px;
      padding: 40px;
      text-align: center;
      max-width: 500px;
      width: 100%;
      cursor: pointer;
      transition: border-color 0.3s;
    }
    #dropZone:hover, #dropZone.active {
      border-color: #ffffff;
    }
    input[type="file"] {
      display: none;
    }
    button {
      padding: 10px 20px;
      margin-top: 20px;
      background-color: #4a4a4a;
      color: #ffffff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 1em;
    }
    button:hover {
      background-color: #5a5a5a;
    }
    button:disabled {
      background-color: #3a3a3a;
      cursor: not-allowed;
    }
  </style>
</head>
<body>
  <h1>Audio Transcription</h1>
  <form id="uploadForm" enctype="multipart/form-data">
    <div id="dropZone">
      Drop your audio file here or click to select one.
      <input type="file" id="audioInput" name="audio" accept="audio/*">
    </div>
    <button type="submit" id="transcribeButton" disabled>Transcribe</button>
  </form>
  <script>
    const dropZone = document.getElementById('dropZone');
    const audioInput = document.getElementById('audioInput');
    const transcribeButton = document.getElementById('transcribeButton');
    const uploadForm = document.getElementById('uploadForm');

    dropZone.addEventListener('click', () => audioInput.click());
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('active');
    });
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('active');
    });
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('active');
      audioInput.files = e.dataTransfer.files;
      transcribeButton.disabled = !audioInput.files.length;
      dropZone.textContent = audioInput.files[0]?.name || 'Drop your audio file here or click to select one.';
    });
    audioInput.addEventListener('change', () => {
      transcribeButton.disabled = !audioInput.files.length;
      dropZone.textContent = audioInput.files[0]?.name || 'Drop your audio file here or click to select one.';
    });
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!audioInput.files.length) return;
      transcribeButton.disabled = true;
      transcribeButton.textContent = 'Transcribing...';
      const formData = new FormData();
      formData.append('audio', audioInput.files[0]);
      try {
        const response = await fetch('/', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Transcription failed: ' + response.statusText);
        }
        const html = await response.text();
        document.open();
        document.write(html);
        document.close();
      } catch (err) {
        alert('Error: ' + err.message);
        transcribeButton.disabled = false;
        transcribeButton.textContent = 'Transcribe';
      }
    });
  </script>
</body>
</html>
`;
