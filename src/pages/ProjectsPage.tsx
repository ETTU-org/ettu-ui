/**
 * Page de gestion des projets
 */

import ProjectManager from "../features/projects/ProjectManager";
import Layout from "../layouts/Layout";

export default function ProjectsPage() {
  return (
    <Layout>
      <ProjectManager />
    </Layout>
  );
}
