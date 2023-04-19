import { OptionGroup } from "../core/options/option-group";
import { supportsSpeechRecognition } from "../core/speech-recognition-types";

export const whisperOptions: OptionGroup = {
    id: 'speech-recognition',
    name: "Micrófono",
    hidden: !supportsSpeechRecognition,
    options: [
        {
            id: 'use-whisper',
            defaultValue: false,
            displayOnSettingsScreen: "speech",
            displayAsSeparateSection: false,
            renderProps: {
                type: "checkbox",
                label: "Use la API Whisper de OpenAI para el reconocimiento de voz",
                hidden: !supportsSpeechRecognition,
            },
        },
        {
            id: 'show-microphone',
            defaultValue: true,
            displayOnSettingsScreen: "speech",
            displayAsSeparateSection: false,
            renderProps: {
                type: "checkbox",
                label: "Mostrar micrófono en la entrada de mensajes",
            },
        },
    ],
}