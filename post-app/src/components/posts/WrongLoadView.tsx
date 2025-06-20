/* eslint-disable @typescript-eslint/no-explicit-any */
const WrongLoadView = ({ error }: { error: any }) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-2xl">
      <div className="text-center p-8">
        <div className="text-red-500 text-4xl mb-4">😕</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Something went wrong
        </h3>
        <p className="text-gray-600 max-w-md">{error}</p>
      </div>
    </div>
  );
};

export default WrongLoadView;
