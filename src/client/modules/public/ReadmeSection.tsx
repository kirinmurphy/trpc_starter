import { MarkdownFile } from '../../widgets/MarkdownFile/index';

export function ReadmeSection(props: {
  readmes: string[];
  toc?: string[];
  title?: string;
  sectionIndex: number;
  offset?: number;
}) {
  const { readmes, toc = [], title, sectionIndex, offset = 150 } = props;

  return (
    <section className="pt-4">
      {!!title && (
        <header className="sticky top-0 z-50 bg-[#242424] pt-4 pb-6 px-2">
          <h2 className="mb-2 text-3xl font-bold">{title}</h2>
          <ul className="list-disc ml-6">
            {toc.map((item, index) => (
              <li key={item}>
                <a
                  className="cursor-pointer"
                  onClick={(event) =>
                    jumpToProject(event, index, sectionIndex, offset)
                  }
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </header>
      )}

      {readmes.map((readmeUrl, index) => (
        <div
          className="pb-6 last:pb-0"
          id={`s-${sectionIndex}-${index}`}
          key={readmeUrl}
        >
          <MarkdownFile readmeUrl={readmeUrl} />
        </div>
      ))}
    </section>
  );
}

function jumpToProject(
  e: React.MouseEvent,
  index: number,
  sectionIndex: number,
  offset: number
) {
  e.preventDefault();
  const el = document.getElementById(`s-${sectionIndex}-${index}`);
  if (!el) return;
  const y = window.scrollY + el.getBoundingClientRect().top - offset;
  window.scrollTo({ top: y, behavior: 'smooth' });
}
