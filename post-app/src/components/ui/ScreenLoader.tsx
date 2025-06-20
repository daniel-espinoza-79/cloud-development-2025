interface ScreenLoaderProps {
  message?: string;
}

const ScreenLoader: React.FC<ScreenLoaderProps> = ({
  message = "Cargando...",
}) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">{message}</p>
    </div>
  </div>
);


export default ScreenLoader;