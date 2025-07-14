import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Shield, Scale, ArrowRight } from 'lucide-react';

const LegalPage: React.FC = () => {
  const legalDocuments = [
    {
      title: "Conditions Générales d'Utilisation",
      description: "Les règles et conditions d'utilisation de l'application ETTU",
      icon: FileText,
      link: "/cgu",
      color: "bg-blue-500",
      colorHover: "hover:bg-blue-600"
    },
    {
      title: "Politique de Confidentialité",
      description: "Comment nous collectons, utilisons et protégeons vos données personnelles",
      icon: Shield,
      link: "/privacy-policy",
      color: "bg-green-500",
      colorHover: "hover:bg-green-600"
    },
    {
      title: "Mentions Légales",
      description: "Informations légales sur l'éditeur et l'hébergement de l'application",
      icon: Scale,
      link: "/legal-notice",
      color: "bg-purple-500",
      colorHover: "hover:bg-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documents Légaux
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Retrouvez ici tous les documents légaux concernant l'utilisation de l'application ETTU.
            Ces documents sont conformes à la réglementation RGPD et au droit français.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {legalDocuments.map((document) => {
            const Icon = document.icon;
            return (
              <Link
                key={document.link}
                to={document.link}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`${document.color} ${document.colorHover} p-3 rounded-lg transition-colors duration-200`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200 ml-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                    {document.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {document.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              À propos de la conformité RGPD
            </h2>
            <p className="text-gray-600 mb-6">
              L'application ETTU est conçue dans le respect du Règlement Général sur la Protection des Données (RGPD).
              Vos données sont stockées localement sur votre appareil et ne sont jamais transmises à des serveurs externes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-green-600 font-medium mb-2">🔒 Sécurité</div>
                <p className="text-gray-700">Stockage local sécurisé dans votre navigateur</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-blue-600 font-medium mb-2">🛡️ Confidentialité</div>
                <p className="text-gray-700">Aucune collecte de données personnelles</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-purple-600 font-medium mb-2">⚖️ Conformité</div>
                <p className="text-gray-700">Respect total du RGPD</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Une question sur nos documents légaux ?
          </p>
          <a
            href="mailto:julesbossis@gmail.com"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <span>Nous contacter</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default LegalPage;
