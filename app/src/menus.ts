export interface MenuItem {
    label: string;
    link: string;
    icon?: string;
}

export const secondaryMenu: MenuItem[] = [
    {
        label: "ChatGPT",
        link: "https://ai.com",
        //icon: "external-link-alt",
    },
    {
        label: "GitHub",
        link: "https://github.com/BongoCaat/chat-with-gpt3-2",
        icon: "github fab",
    },
];