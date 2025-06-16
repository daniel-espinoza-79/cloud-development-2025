import { MessageSquare } from "lucide-react";

interface EmptyStateProps {
  hasSearchTerm: boolean;
  onCreateClick: () => void;
}

const EmptyPostList = ({ hasSearchTerm, onCreateClick }: EmptyStateProps) => (
  <div className="text-center py-16">
    <MessageSquare className="h-20 w-20 text-gray-300 mx-auto mb-6" />
    <h3 className="text-xl font-medium text-gray-900 mb-3">
      {hasSearchTerm ? "No se encontraron posts" : "No tienes posts aún"}
    </h3>
    <p className="text-gray-500 mb-6 max-w-md mx-auto">
      {hasSearchTerm
        ? "Intenta con otros términos de búsqueda o ajusta tus filtros"
        : "Comienza creando tu primer post y comparte tus ideas con el mundo"}
    </p>
    {!hasSearchTerm && (
      <button
        onClick={onCreateClick}
        className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
      >
        Crear mi primer post
      </button>
    )}
  </div>
);

export default EmptyPostList;
