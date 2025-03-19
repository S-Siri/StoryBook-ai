from flask import Flask, request, jsonify, send_file
import os
import torch
from TTS.api import TTS
from flask_cors import CORS



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load the TTS model
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")
tts = TTS("tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False).to(device)
print("TTS Model loaded successfully")

@app.route("/synthesize", methods=["POST"])
def synthesize():
    data = request.json
    if "text" not in data:
        return jsonify({"error": "Missing 'text' parameter"}), 400

    text = data["text"]
    output_path_wav = "output.wav"
    output_path_mp3 = "output.mp3"

    # Generate audio using TTS
    tts.tts_to_file(text=text, file_path=output_path_wav)

    # Convert to mp3 using ffmpeg
    os.system(f"ffmpeg -i {output_path_wav} {output_path_mp3}")

    audio_url = "http://127.0.0.1:5002/get_audio"
    return jsonify({"message": "Synthesis complete", "audio_url": audio_url})


@app.route("/get_audio", methods=["GET"])
def get_audio():
    output_path = os.path.abspath("output.mp3")

    if not os.path.exists(output_path):
        print("File not found:", output_path)
        return jsonify({"error": "File not found"}), 404

    print("Serving audio file:", output_path)
    return send_file(output_path, mimetype="audio/mpeg", as_attachment=False)




if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
