import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Button, CopyButton } from '@mantine/core';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

const Code = styled.div`
  padding: 0;
  border-radius: 0.25rem;
  overflow: hidden;

  & > div {
    margin: 0 !important;
  }

  .fa {
    font-style: normal !important;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #191919;
  height: 2.5rem;
  padding: 0.1rem 0.5rem;
`;

const LanguageLabel = styled.div`
  background-color: #191919;
  color: #fff;
  font-size: 0.8rem;
  margin-left: 0.3rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const ImagePreview = styled.div`
  text-align: center;

  img {
    max-width: 30rem !important;
    display: block;
  }
`;

export interface MarkdownProps {
  content: string;
  className?: string;
  katex?: boolean;
}

export function Markdown(props: MarkdownProps) {
  const intl = useIntl();

  const classes = useMemo(() => {
    const classes = ['prose', 'dark:prose-invert'];

    if (props.className) {
      classes.push(props.className);
    }

    return classes;
  }, [props.className]);

  const elem = useMemo(() => {
    const remarkPlugins: any[] = [remarkGfm];
    const rehypePlugins: any[] = [];

    if (props.katex) {
      remarkPlugins.push(remarkMath);
      rehypePlugins.push(rehypeKatex);
    }

    return (
      <div className={classes.join(' ')}>
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          rehypePlugins={rehypePlugins}
          components={{
            ol({ start, children }) {
              return (
                <ol start={start ?? 0} style={{ counterReset: `list-item ${(start || 0)}` }}>
                  {children}
                </ol>
              );
            },
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const code = String(children);
              const language = match?.[1] || 'text';

              return !inline ? (
                <>
                  <Code>
                    <Header>
                      <LanguageLabel>{language}</LanguageLabel>
                      <ButtonContainer>
                        {code.startsWith('<svg') && code.includes('</svg>') && (
                          <Button
                            variant="subtle"
                            size="sm"
                            compact
                            onClick={() => {
                              const blob = new Blob([code], { type: 'image/svg+xml' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = 'image.svg';
                              a.click();
                            }}
                          >
                            <i className="fa fa-download" />
                            <span>
                              <FormattedMessage defaultMessage="Descargar SVG" />
                            </span>
                          </Button>
                        )}
                        <CopyButton value={code}>
                          {({ copy, copied }) => (
                            <Button variant="subtle" size="sm" compact onClick={copy}>
                              <i className="fa fa-clipboard" />
                              <span>
                                {copied ? (
                                  <FormattedMessage defaultMessage="Copiado" />
                                ) : (
                                  <FormattedMessage defaultMessage="Copiar" />
                                )}
                              </span>
                            </Button>
                          )}
                        </CopyButton>
                      </ButtonContainer>
                    </Header>
                    <SyntaxHighlighter
                      children={code}
                      style={vscDarkPlus as any}
                      language={language}
                      PreTag="div"
                      {...props}
                    />
                  </Code>
                  {code.startsWith('<svg') && code.includes('</svg>') && (
                    <ImagePreview>
                        <object type="image/svg+xml" data={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(code)}`}>
                            SVG Preview
                        </object>
                    </ImagePreview>
                  )}
                </>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {props.content}
        </ReactMarkdown>
      </div>
    );
  }, [props.content, props.katex, classes, intl]);

  return elem;
}
