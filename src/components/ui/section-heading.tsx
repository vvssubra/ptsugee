type SectionHeadingProps = {
  headingId?: string;
  eyebrow?: string;
  heading: string;
  body?: string;
  align?: "start" | "center";
};

export function SectionHeading({
  headingId,
  eyebrow,
  heading,
  body,
  align = "start",
}: SectionHeadingProps) {
  return (
    <div className={`section-heading section-heading--${align}`}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={headingId}>{heading}</h2>
      {body ? <p className="section-heading__body">{body}</p> : null}
    </div>
  );
}
