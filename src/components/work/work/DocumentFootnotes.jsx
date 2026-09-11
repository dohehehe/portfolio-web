import footnoteStyles from "./EditorFootnotes.module.css";

export default function DocumentFootnotes({ footnotes }) {
  if (!footnotes?.length) {
    return null;
  }

  return (
    <aside className={footnoteStyles.footnotesSection}>
      {footnotes.map((note) => (
        <p
          key={note.footnoteId}
          id={note.footnoteId}
          className={footnoteStyles.footnoteItem}
        >
          <sup className={footnoteStyles.footnoteMarker}>{note.superscript}</sup>
          <span dangerouslySetInnerHTML={{ __html: note.content }} />
        </p>
      ))}
    </aside>
  );
}
