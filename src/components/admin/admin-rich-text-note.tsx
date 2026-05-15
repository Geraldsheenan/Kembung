import { getLimitedRichTextNotes } from "@/lib/rich-text";

type AdminRichTextNoteProps = {
  title?: string;
  extraNotes?: string[];
};

export function AdminRichTextNote({
  title = "Notes formatting",
  extraNotes = [],
}: AdminRichTextNoteProps) {
  const notes = [...getLimitedRichTextNotes(), ...extraNotes];

  return (
    <div className="rounded-[1.25rem] border border-sky-100 bg-sky-50/70 px-4 py-3 text-sm leading-7 text-sky-900">
      <p className="font-semibold">{title}</p>
      <ul className="mt-1 list-disc pl-5">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  );
}
