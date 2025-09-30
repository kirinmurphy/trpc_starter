import { Components } from 'react-markdown';
import { Mermaid } from './Mermaid';

type CodeComponentProps = React.ComponentProps<'code'> & {
  inline?: boolean;
  className?: string;
};

function CodeComponent(props: CodeComponentProps) {
  const { inline, className, children, ...rest } = props;
  const lang = /language-(\w+)/.exec(className || '')?.[1];
  if (!inline && lang === 'mermaid')
    return <Mermaid chart={String(children).trim()} />;
  return (
    <code className={className} {...rest}>
      {children}
    </code>
  );
}

export default CodeComponent as NonNullable<Components['code']>;
