import { FormattedMessage } from "react-intl";
import Plugin from "../core/plugins";
import { PluginDescription } from "../core/plugins/plugin-description";
import { OpenAIMessage, Parameters } from "../core/chat/types";
import { getIndicatorOptions } from "../store/IndicatorOptions";
import React from "react";

export const defaultSystemPrompt = `
You are ChatGPT, a large language model trained by OpenAI (Reply in the user's language).
Knowledge cutoff: 2021-09
Current date and time: {{ datetime }}
`.trim();

interface SystemPromptPluginOptions {
    systemPrompt: string;
    systemPromptDropdown: string | undefined;
}

export class SystemPromptPlugin extends Plugin<SystemPromptPluginOptions> {
  updateOptions: (options: SystemPromptPluginOptions) => void = () => {};
  describe(): PluginDescription {
      const indicatorOptions = getIndicatorOptions();
      const options = [
          {
              id: "systemPrompt",
              defaultValue: defaultSystemPrompt,
              displayOnSettingsScreen: "chat",
              resettable: true,
              scope: "chat",
              renderProps: {
                  type: "textarea",
                  id: "textarea",
              },
              displayInQuickSettings: {
                  name: "Mensaje del sistema",
                  displayByDefault: false,
                  label: "Personalizar mensaje del sistema",
              },
          },
          {
            id: "systemPromptDropdown",
            defaultValue: defaultSystemPrompt,
            displayOnSettingsScreen: "chat",
            resettable: true,
            scope: "chat",
            renderProps: {
                type: "select",
                options: [
                    ...indicatorOptions.map(option => ({
                      value: `${option.value} (Reply in the user's language only if the prompt isn't for a specific language).`,
                      label: option.label
                    })),
                ],
                onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedOption = e.target.value;
                    const indicatorOption = indicatorOptions.find(option => option.value === selectedOption);
                    const systemPrompt = (indicatorOption?.value ?? this.options?.systemPrompt ?? defaultSystemPrompt)
                        .replace('{{ selectedOption }}', indicatorOption?.value ?? '');
                    this.updateOptions({ systemPromptDropdown: selectedOption, systemPrompt });
                    const textarea = this.textareaRef.current;
                    if (textarea) {
                        textarea.value = systemPrompt;
                    }
                },
                description: <p>
                    <FormattedMessage defaultMessage={"El mensaje del sistema es un mensaje invisible insertado al comienzo del chat y se puede utilizar para darle información a ChatGPT sobre sí mismo y pautas generales sobre cómo debe responder. La etiqueta <code>'{{ datetime }}'</code> se reemplaza automáticamente por la fecha y hora actuales (Use esto para dar acceso a la IA a la hora)."}
                      values={{ code: v => <code>{v}</code> }} />
                </p>,
            },
        },
      ];

      return {
          id: "system-prompt",
          name: "Mensaje del sistema",
          options: options as any,
      };
  }

  textareaRef = React.createRef<HTMLTextAreaElement>();

  constructor(props: any) {
      super(props);
      this.textareaRef = React.createRef<HTMLTextAreaElement>();
      this.updateOptions({ systemPromptDropdown: undefined, systemPrompt: defaultSystemPrompt });
  }

  async preprocessModelInput(messages: OpenAIMessage[], parameters: Parameters): Promise<{ messages: OpenAIMessage[]; parameters: Parameters; }> {
      const systemPrompt = (this.options?.systemPrompt ?? defaultSystemPrompt)
          .replace('{{ datetime }}', new Date().toLocaleString());
      const systemPromptDropdown = this.options?.systemPromptDropdown;
      const output = [
          {
              role: 'system',
              content: systemPromptDropdown ?? systemPrompt,
          },
          ...messages,
      ];

      return {
          messages: output,
          parameters,
      };
  }
}
