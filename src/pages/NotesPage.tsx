import Layout from "../layouts/Layout";
import NoteEditor from "../features/notes/NoteEditor";

export default function NotesPage() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Créer une note</h1>
      <NoteEditor />
    </Layout>
  );
}
