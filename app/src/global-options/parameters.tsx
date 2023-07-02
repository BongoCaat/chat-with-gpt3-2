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
                description: value?.includes('gpt-4') && context.intl.formatMessage(
                    {
                        defaultMessage: "Nota: Este modelo solo funcionará si a su cuenta de OpenAI se le ha otorgado acceso al nuevo modelo. <a>Solicite acceso aquí.</a>",
                    },
                    { 
                        a: (text: string) => <a href="https://openai.com/waitlist/gpt-4-api" target="_blank" rel="noreferrer">{text}</a>
                    } as any,
                ),
                options: [
                    {
                        label: "GPT 3.5 Turbo (Por defecto)",
                        value: "gpt-3.5-turbo",
                    },
                    {
                        label: "GPT 3.5 Turbo 16k",
                        value: "gpt-3.5-turbo-16k",
                    },
                    {
                        label: "GPT 4 (Requiere invitación)",
                        value: "gpt-4",
                    },
                    {
                        label: "GPT 4 32k (Requiere invitación)",
                        value: "gpt-4-32k",
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
                label: (value) => "Temperatura: " + value.toFixed(1),
            },
            renderProps: (value, options, context) => ({
                type: "slider",
                label: "Temperatura: " + value.toFixed(1),
                min: 0,
                max: 1,
                step: 0.1,
                description: context.intl.formatMessage({ defaultMessage: "El parámetro de temperatura controla la aleatoriedad de las respuestas de la IA. Los valores más bajos harán que la IA sea más precisa, mientras que los valores más altos lo harán más creativo." }),
            })
        }
    ],
};
