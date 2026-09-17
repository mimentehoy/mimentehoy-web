type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-6 flex flex-col gap-3">
      <span className="soft-label w-fit">{eyebrow}</span>
      <h2 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">{description}</p> : null}
    </div>
  );
}
