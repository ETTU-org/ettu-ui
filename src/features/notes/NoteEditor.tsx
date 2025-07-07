import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";

export default function NoteEditor() {
  const [content, setContent] = useState(
    `# Nouvelle note\n\nCommencez à écrire en markdown...`
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Éditeur */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Éditeur Markdown</h2>
        <CodeMirror
          value={content}
          height="50rem"
          extensions={[markdown()]}
          theme="dark"
          onChange={(value) => setContent(value)}
        />
      </div>

      {/* Preview */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Prévisualisation</h2>
        <MarkdownPreview content={content} />
      </div>
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  return (
    <div
      className="bg-gray-900 p-4 rounded shadow overflow-y-auto h-[50rem] text-white text-sm leading-relaxed"
      dangerouslySetInnerHTML={{
        __html: markdownToHTML(content),
      }}
    />
  );
}

// Simple renderer sans dépendance
function markdownToHTML(md: string): string {
  // 1. Blocs de code ```lang\ncode\n```
  md = md.replace(/```(\w+)\n([\s\S]*?)```/g, (_, lang, code) => {
    const cleaned = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre class="bg-gray-800 text-gray-100 text-sm rounded p-4 overflow-x-auto mb-4"><code class="language-${lang}">${cleaned}</code></pre>`;
  });

  // 2. Titres
  md = md
    .replace(/^### (.*)$/gm, `<h3 class="text-xl font-bold mb-2">$1</h3>`)
    .replace(/^## (.*)$/gm, `<h2 class="text-2xl font-bold mb-3">$1</h2>`)
    .replace(/^# (.*)$/gm, `<h1 class="text-3xl font-bold mb-4">$1</h1>`);

  // 3. Formatage inline
  md = md
    .replace(/\*\*(.*?)\*\*/g, `<strong class="font-semibold">$1</strong>`)
    .replace(/\*(.*?)\*/g, `<em class="italic text-gray-300">$1</em>`)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      `<a href="$2" class="text-blue-400 underline" target="_blank">$1</a>`
    );

  // 4. Listes
  md = md
    .replace(/^\s*-\s+(.*)$/gm, `<li>$1</li>`)
    .replace(
      /(<li>.*<\/li>)/gms,
      `<ul class="list-disc pl-5 space-y-1 mb-4">$1</ul>`
    );

  // 5. Paragraphes & retour à la ligne
  md = md
    .split(/\n{2,}/) // coupe en paragraphes
    .map((para) => {
      // ignore déjà transformés (<h1>, <ul>, <pre>...)
      if (/^\s*<(h\d|ul|pre|blockquote|table)/.test(para)) return para;
      return `<p class="mb-4">${para.replace(/\n/g, "<br />")}</p>`;
    })
    .join("");

  return md;
}
