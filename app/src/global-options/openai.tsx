import { FormattedMessage } from "react-intl";
import { OptionGroup } from "../core/options/option-group";

export const openAIOptions: OptionGroup = {
    id: 'openai',
    options: [
        {
            id: 'apiKey',
            defaultValue: "",
            displayOnSettingsScreen: "user",
            displayAsSeparateSection: true,
            renderProps: () => ({
                type: "password",
                label: "Tu clave API de OpenAI",
                placeholder: "sk-************************************************",
                description: <>
                    <p>
                        <a href="https://platform.openai.com/account/api-keys" target="_blank" rel="noreferrer">
                            <FormattedMessage defaultMessage="Encuentra tu clave API aquí." description="Etiqueta para el enlace que lleva al usuario a la página en el sitio web de OpenAI donde puede encontrar su clave API." />
                        </a>
                    </p>
                    <p>
                        <FormattedMessage defaultMessage="Su clave API se almacena solo en este dispositivo y nunca se transmite a nadie excepto OpenAI." />
                    </p>
                    <p>
                        <FormattedMessage defaultMessage="El uso de la clave de la API de OpenAI se factura a una tarifa de pago por uso, separado de su suscripción ChatGPT." />
                    </p>
                </>,
            }),
        },
    ],
}