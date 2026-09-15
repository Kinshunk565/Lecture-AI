import json
import os
import sys

# Ensure required directories exist
os.makedirs("audios", exist_ok=True)
os.makedirs("jsons", exist_ok=True)

try:
    import whisper
except ImportError:
    print("Error: 'openai-whisper' package is not installed. Please run: pip install openai-whisper")
    sys.exit(1)

model = whisper.load_model("large-v2")

audios = os.listdir("audios")
if not audios:
    print("No audio files found in 'audios/' directory. Place your .mp3 files in 'audios/' and run again.")
else:
    for audio in audios:
        if not audio.endswith(".mp3"):
            continue

        if "_" in audio:
            parts = audio.split("_", 1)
            number = parts[0]
            title = os.path.splitext(parts[1])[0]
        else:
            number = "1"
            title = os.path.splitext(audio)[0]

        print(f"Transcribing Audio #{number}: {title}")
        audio_path = os.path.join("audios", audio)
        
        result = model.transcribe(
            audio=audio_path,
            language="hi",
            task="translate",
            word_timestamps=False
        )

        chunks = []
        for segment in result.get("segments", []):
            chunks.append({
                "number": number,
                "title": title,
                "start": segment["start"],
                "end": segment["end"],
                "text": segment["text"]
            })

        chunks_with_metadata = {"chunks": chunks, "text": result.get("text", "")}

        out_json_path = os.path.join("jsons", f"{audio}.json")
        with open(out_json_path, "w", encoding="utf-8") as f:
            json.dump(chunks_with_metadata, f, ensure_ascii=False, indent=2)

    print("Transcriptions complete.")