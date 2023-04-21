import { defaultModel } from "../core/chat/openai";
import { OptionGroup } from "../core/options/option-group";

export const parameterOptions: OptionGroup = {
    id: 'parameters',
    options: [
        {
            id: "model",
            defaultValue: defaultModel,
            resettable: true,
            scope: "user",
            displayOnSettingsScreen: "chat",
            displayAsSeparateSection: true,
            displayInQuickSettings: {
                name: "Modelo",
                displayByDefault: true,
                label: (value) => value,
            },
            renderProps: (value, options, context) => ({
                type: "select",
                label: "Modelo",
                description: value === 'gpt-4' && context.intl.formatMessage(
                    {
                        defaultMessage: "Nota: GPT-4 solo funcionará si a su cuenta OpenAI se le ha otorgado acceso al nuevo modelo. <a>Solicite acceso aquí.</a>",
                    },
                    { 
                        a: (text: string) => <a href="https://openai.com/waitlist/gpt-4-api" target="_blank" rel="noreferer">{text}</a> 
                    } as any,
                ),
                options: [
                    {
                        label: "GPT 3.5 Turbo (Por defecto)",
                        value: "gpt-3.5-turbo",
                    },
                    {
                        label: "GPT 4 (Requiere invitación)",
                        value: "gpt-4",
                    },
                ],
            }),
        },
        {
            id: "temperature",
            defaultValue: 0.5,
            resettable: true,
            scope: "chat",
            displayOnSettingsScreen: "chat",
            displayAsSeparateSection: true,
            displayInQuickSettings: {
                name: "Temperatura",
                displayByDefault: true,
                label: (value) => `Temperatura: ${value.toFixed(1)}`,
            },
            renderProps: (value, options, context) => ({
                type: "slider",
                label: `Temperatura: ${value.toFixed(1)}`,
                min: 0,
                max: 1,
                step: 0.1,
                style: {
                    textAlign: "center",
                },
                children: (
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", marginBottom: "2.5rem" }}>
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontWeight: value <= 0 ? "bold" : "normal" }}>Preciso</p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontWeight: value > 0 && value < 1 ? "bold" : "normal" }}>Neutro</p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <p style={{ fontWeight: value >= 1 ? "bold" : "normal" }}>Creativo</p>
                        </div>
                    </div>
                ),
                description: context.intl.formatMessage({ defaultMessage: "El parámetro de temperatura controla la aleatoriedad de las respuestas de la IA. Los valores más bajos harán que la IA sea más precisa, mientras que los valores más altos lo harán más creativo." }),
            }),
        },
    ],
};