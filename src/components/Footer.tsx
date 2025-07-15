import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col space-y-4">
          {/* Liens légaux */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            <Link
              to="/cgu"
              className="hover:text-white transition-colors duration-200"
            >
              Conditions Générales d'Utilisation
            </Link>
            <Link
              to="/privacy-policy"
              className="hover:text-white transition-colors duration-200"
            >
              Politique de Confidentialité
            </Link>
            <Link
              to="/legal-notice"
              className="hover:text-white transition-colors duration-200"
            >
              Mentions Légales
            </Link>
          </div>

          {/* Séparateur */}
          <div className="border-t border-gray-700 pt-4">
            <p className="flex flex-col sm:flex-row items-center justify-center gap-2">
              <span>
                © {new Date().getFullYear()} ETTU – Outil d'organisation pour
                développeurs.
              </span>
              <span className="hidden sm:inline">•</span>
              <a
                href="https://github.com/ettu-org"
                className="underline hover:text-white transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Voir sur GitHub
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
