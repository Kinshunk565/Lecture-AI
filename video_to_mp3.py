# Converts the videos to mp3 
import os 
import subprocess

# Ensure required directories exist
os.makedirs("videos", exist_ok=True)
os.makedirs("audios", exist_ok=True)

files = os.listdir("videos")
if not files:
    print("No video files found in 'videos/' directory. Place your video files in 'videos/' and run again.")
else:
    for idx, file in enumerate(files, start=1):
        if file.startswith("."):
            continue
        
        # Robust parsing for tutorial number and clean title
        tutorial_number = str(idx)
        file_name = os.path.splitext(file)[0]

        if " #" in file:
            try:
                tutorial_number = file.split(" [")[0].split(" #")[1]
            except IndexError:
                pass

        if " ｜ " in file:
            file_name = file.split(" ｜ ")[0]

        print(f"Processing Video #{tutorial_number}: {file_name}")
        out_path = os.path.join("audios", f"{tutorial_number}_{file_name}.mp3")
        subprocess.run(["ffmpeg", "-y", "-i", os.path.join("videos", file), out_path])