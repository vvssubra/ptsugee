type SpecificationGroup = { heading: string; items: string[] };

export function TechnicalSpecifications({ groups }: { groups: SpecificationGroup[] }) {
  return (
    <div className="technical-specifications">
      {groups.map((group) => (
        <dl key={group.heading}>
          <dt>{group.heading}</dt>
          {group.items.map((item) => <dd key={item}>{item}</dd>)}
        </dl>
      ))}
    </div>
  );
}
