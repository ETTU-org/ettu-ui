/**
 * Page principale pour la gestion des tâches TODO
 */

import Layout from "../layouts/Layout";
import TodoManager from "../features/todos/TodoManager";

export default function TodosPage() {
  return (
    <Layout>
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0">
          <TodoManager />
        </div>
      </div>
    </Layout>
  );
}
