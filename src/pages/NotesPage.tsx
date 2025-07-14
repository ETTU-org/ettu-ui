import Layout from "../layouts/Layout";
import NoteEditor from "../features/notes/NoteEditor";

export default function NotesPage() {
  return (
    <Layout>
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0">
          <NoteEditor />
        </div>
      </div>
    </Layout>
  );
}
