import torch
import torchaudio
from TTS.api import TTS
import os

OUTPUT_DIR = "static/audio"

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load TTS model (Change model_name if needed)
MODEL_NAME = "tts_models/en/ljspeech/tacotron2-DDC"
tts = TTS(model_name=MODEL_NAME, progress_bar=False).to("cpu")

def generate_tts(text):
    audio_path = os.path.join(OUTPUT_DIR, "output.wav")

    try:
        tts.tts_to_file(text=text, file_path=audio_path)
        return audio_path
    except Exception as e:
        print("Error in TTS:", e)
        return None
