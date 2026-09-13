"use client";
import { useState } from "react";
type FaqItem = { question: string; answer: string };
export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return <div className="faq-accordion">{items.map((item, index) => { const open = openIndex === index; const panelId = `faq-panel-${index}`; return <div className="faq-item" key={item.question}><h3><button aria-controls={panelId} aria-expanded={open} onClick={() => setOpenIndex(open ? null : index)} type="button"><span>{item.question}</span><span aria-hidden="true">{open ? "−" : "+"}</span></button></h3><div className="faq-item__answer" hidden={!open} id={panelId}><p>{item.answer}</p></div></div>; })}</div>;
}
