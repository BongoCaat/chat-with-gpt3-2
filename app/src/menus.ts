export interface MenuItem {
    label: string;
    link: string;
    icon?: string;
}

export const secondaryMenu: MenuItem[] = [
    {
        label: "APIs",
        link: "https://controlc.com/49931130",
    },
    {
        label: "ChatGPT",
        link: "https://ai.com",
        //icon: "external-link-alt",
    },
    {
        label: "GitHub",
        link: "https://github.com/BongoCaat/chat-with-gpt3",
        icon: "github fab",
    },
];