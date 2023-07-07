import { OptionGroup } from "../core/options/option-group";

export const autoScrollOptions: OptionGroup = {
    id: 'auto-scroll',
    name: "Desplazamiento automático",
    options: [
        {
            id: 'auto-scroll-when-opening-chat',
            defaultValue: true,
            displayOnSettingsScreen: "ui",
            displayAsSeparateSection: false,
            renderProps: {
                type: "checkbox",
                label: "Desplazamiento automático al abrir un chat",
            },
        },
        {
            id: 'auto-scroll-while-generating',
            defaultValue: false,
            displayOnSettingsScreen: "ui",
            displayAsSeparateSection: false,
            renderProps: {
                type: "checkbox",
                label: "Desplazamiento automático mientras se genera una respuesta",
            },
        },
    ],
}

export const inputOptions: OptionGroup = {
    id: 'input',
    name: "Entrada de mensajes",
    options: [
        {
            id: 'submit-on-enter',
            defaultValue: true,
            displayOnSettingsScreen: "ui",
            displayAsSeparateSection: false,
            displayInQuickSettings: {
                name: "Habilitar/Deshabilitar Enter",
                displayByDefault: true,
                label: (value) => value ? "Deshabilitar Enter" : "Habilitar Enter",
            },
            renderProps: {
                type: "checkbox",
                label: "Enviar mensaje cuando se presiona Enter",
            },
        },
    ],
}

export const markdownOptions: OptionGroup = {
    id: 'markdown',
    name: "Markdown",
    options: [
        {
            id: 'katex',
            defaultValue: true,
            displayOnSettingsScreen: "ui",
            displayInQuickSettings: {
                name: "Habilitar/Deshabilitar Katex",
                displayByDefault: true,
                label: (value) => value ? "Deshabilitar Katex" : "Habilitar Katex",
            },
            renderProps: {
                type: "checkbox",
                label: "Habilitar la representación matemática de Katex ( Experimental )",
                description: "Usa ' $ ' antes y luego de la operación matemática. Ej: $x = 5$",
            },
        },
    ],
}