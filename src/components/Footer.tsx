export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-6 text-center text-sm">
      <p>
        © {new Date().getFullYear()} ETTU – Outil d’organisation pour
        développeurs.{" "}
        <a
          href="https://github.com/ettu-org"
          className="underline hover:text-white"
          target="_blank"
          rel="noopener noreferrer"
        >
          Voir sur GitHub
        </a>
      </p>
    </footer>
  );
}
