import styled from '@emotion/styled';
import { Button } from '@mantine/core';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useAppDispatch } from '../../store';
import { openOpenAIApiKeyPanel } from '../../store/settings-ui';
import { Page } from '../page';
import { useOption } from '../../core/options/use-option';
import { isProxySupported } from '../../core/chat/openai';

const Container = styled.div`
    flex-grow: 1;
    padding-bottom: 5vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: "Work Sans", sans-serif;
    line-height: 1.7;
    gap: 1rem;
`;

export default function LandingPage(props: any) {
    const [openAIApiKey] = useOption<string>('openai', 'apiKey');
    const dispatch = useAppDispatch();
    const onConnectButtonClick = useCallback(() => dispatch(openOpenAIApiKeyPanel()), [dispatch]);

    return <Page id={'landing'} showSubHeader={true}>
        <Container>
            <p>
                <FormattedMessage defaultMessage={'Hola, ¿cómo puedo ayudarle hoy? 🤓☝️'}
                    description="Un mensaje amistoso que aparece al comienzo de las nuevas sesiones de chat." />
            </p>
            {!openAIApiKey && !isProxySupported() && (
                <Button size="xs" variant="light" compact onClick={onConnectButtonClick}>
                    <FormattedMessage defaultMessage={'Conecte su cuenta de OpenAI para comenzar'} />
                </Button>
            )}
        </Container>
    </Page>;
}
