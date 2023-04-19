import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../core/context';
import { useAppDispatch } from '../../store';
import { toggleSidebar } from '../../store/sidebar';
import { ActionIcon, Button, Loader, Input, Menu, Textarea } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { backend } from '../../core/backend';

const Container = styled.div`
    margin: calc(1.2rem - 0.8rem);
    margin-top: 0rem;
    margin-right: 0.43rem;
`;

const Empty = styled.p`
    text-align: center;
    font-size: 1.2rem;
    padding: 1rem;
`;

const ChatList = styled.div`
  max-height: 43rem;
`;

const ChatListItemLink = styled(Link)`
    display: block;
    position: relative;
    padding: 0.4rem 1rem;
    margin: 0.218rem 0;
    line-height: 1.7;
    text-decoration: none;
    border-radius: 0.25rem;

    &:hover, &:focus, &:active {
        background: rgba(0, 0, 0, 0.1);
    }

    &.selected {
        background: #2b3d54;
    }

    strong {
        display: block;
        font-weight: 400;
        font-size: 1rem;
        line-height: 1.6;
        padding-right: 1rem;
        color: white;
    }

    p {
        font-size: 0.8rem;
        font-weight: 200;
        opacity: 0.8;
    }

    .mantine-ActionIcon-root {
        position: absolute;
        right: 0.0rem;
        top: 50%;
        margin-top: -22px;
        opacity: 0;
    }

    &:hover {
        .mantine-ActionIcon-root {
            opacity: 1;
        }
    }
`;

function ChatListItem(props: { chat: any, onClick: any, selected: boolean; index: number; selectedIndex: number; onSelect: (chatID: string, index: number) => void;}) {
    const c = props.chat;
    const context = useAppContext();
    const modals = useModals();
    const navigate = useNavigate();

    const onDelete = useCallback((e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        modals.openConfirmModal({
            title: "¿Estás seguro de que quieres eliminar este chat?",
            children: <p style={{ lineHeight: 1.7 }}>El chat "{c.title}" se eliminará permanentemente. Esto no se puede deshacer.</p>,
            labels: {
                confirm: "Borrar permanentemente",
                cancel: "Cancelar",
            },
            confirmProps: {
                color: 'red',
            },
            onConfirm: async () => {
                try {
                    await backend.current?.deleteChat(c.chatID);
                    context.chat.deleteChat(c.chatID);
                    navigate('/');
                } catch (e) {
                    console.error(e);
                    modals.openConfirmModal({
                        title: "Algo salió mal",
                        children: <p style={{ lineHeight: 1.7 }}>El chat "{c.title}" no se pudo eliminar.</p>,
                        labels: {
                            confirm: "Intentar otra vez",
                            cancel: "Cancelar",
                        },
                        onConfirm: () => onDelete(),
                    });
                }
            },
        });
    }, [c.chatID, c.title]);

    const onRename = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Display a modal with a TextInput
        modals.openModal({
            title: "Renombrar chat",
            children: <div>
                <Textarea
                    id="chat-title"
                    defaultValue={c.title}
                    maxLength={500}
                    autosize
                    required />
                <Button
                    fullWidth
                    variant="light"
                    style={{ marginTop: '1rem' }}
                    onClick={() => {
                        const title = document.querySelector<HTMLInputElement>('#chat-title')?.value?.trim();
                        const ychat = context.chat.doc.getYChat(c.chatID);
                        if (ychat && title && title !== ychat?.title) {
                            ychat.title = title;
                        }
                        modals.closeAll();
                    }}
                >
                    Guardar cambios
                </Button>
            </div>,
        });
    }, [c.chatID, c.title]);

    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setMenuOpen(open => !open);
    }, []);

    return (
        <ChatListItemLink to={'/chat/' + c.chatID}
            onClick={props.onClick}
            data-chat-id={c.chatID}
            className={props.selected ? 'selected' : ''}>
            <strong>{c.title || <FormattedMessage defaultMessage={"Sin titulo"} description="Título predeterminado para sesiones de chat sin título" />}</strong>
            <Menu opened={menuOpen}
                    closeOnClickOutside={true}
                    closeOnEscape={true}
                    onClose={() => setMenuOpen(false)}>
                <Menu.Target>
                    <ActionIcon size="xl" onClick={toggleMenu}>
                        <i className="fas fa-ellipsis" />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Menu.Item onClick={onRename} color="green" icon={<i className="fa fa-edit" />}>
                        <FormattedMessage defaultMessage={"Renombrar este chat"} />
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item onClick={onDelete} color="red" icon={<i className="fa fa-trash" />}>
                        <FormattedMessage defaultMessage={"Eliminar este chat"} />
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </ChatListItemLink>
    );
}

export default function RecentChats(props: any) {
    const context = useAppContext();
    const dispatch = useAppDispatch();

    const currentChatID = context.currentChat.chat?.id;
    const [searchQuery, setSearchQuery] = useState('');
    const [scrollPosition, setScrollPosition] = useState(0);

    const recentChats = context.chat.search.query(searchQuery);
    const [selectedChatIndex, setSelectedChatIndex] = useState(-1);

    const onClick = useCallback((e: React.MouseEvent) => {
        if (e.currentTarget.closest('button')) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (window.matchMedia('(max-width: 40em)').matches) {
            dispatch(toggleSidebar());
        }
    }, [dispatch]);

    useEffect(() => {
        const selectedChat = recentChats.find((c) => c.chatID === currentChatID);

        if (selectedChat) {
          const index = recentChats.indexOf(selectedChat);
          if (index !== 0) {
            recentChats.splice(index, 1);
            recentChats.unshift(selectedChat);
            setSelectedChatIndex(0);
          } else {
            setSelectedChatIndex(index);
          }
        } else {
          setSelectedChatIndex(-1);
        }
        if (currentChatID) {
          const el = document.querySelector(`[data-chat-id="${currentChatID}"]`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
    }, [currentChatID, recentChats]);

    const handleChatSelection = useCallback(
        (chatID: string, index: number) => {
          if (chatID === currentChatID) {
            setSelectedChatIndex(index);
          } else {
            setSelectedChatIndex(-1);
          }
        },
        [currentChatID]
      );

      const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setSelectedChatIndex(-1);
        setScrollPosition(0);
      };

      const handleClearSearch = () => {
        setSearchQuery('');
        setSelectedChatIndex(-1);
        setScrollPosition(0);
      };

      const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
        const isAtBottom = scrollTop + clientHeight === scrollHeight;
        if (isAtBottom) {
        }
    };

    const synced = !backend.current || backend.current?.isSynced();

    return (
        <Container>
            <Input
                placeholder="Buscar chats"
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ marginTop: '1rem', marginBottom: '1rem' }}
            />
            {searchQuery && (
                <Button variant="filled" onClick={handleClearSearch} style={{ marginBottom: '0.85rem'}} >
                    Borrar búsqueda
                </Button>
            )}
            {recentChats.length > 0 && <ChatList onScroll={handleScroll}>
                {recentChats.map((c, index) => (
                    <ChatListItem key={c.chatID} chat={c} onClick={onClick} selected={c.chatID === currentChatID} index={index} selectedIndex={selectedChatIndex} onSelect={handleChatSelection} />
                ))}
            </ChatList>}
            {recentChats.length === 0 && !synced && <Empty>
                <Loader size="sm" variant="dots" />
            </Empty>}
            {recentChats.length === 0 && synced && <Empty>
                <FormattedMessage defaultMessage={"No hay chats todavía."} description="Mensaje que se muestra en la pantalla del historial de chat para nuevos usuarios que no han comenzado su primera sesión de chat" />
            </Empty>}
        </Container>
    );
}
