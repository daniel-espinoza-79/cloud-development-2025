import EditButtons from "./edit-buttons";

interface DataItemCard {
  id: string;
  name: string;
  imageUrl: string;
}
interface ItemCardProps {
  item: DataItemCard;
  onItemSelect(item: DataItemCard): void;
  onStartEdit?: (id: string) => void;
  onStartDelete?: (id: string) => void;
  isEditable?: boolean;
}

const ItemCard = ({
  item,
  onItemSelect,
  isEditable = false,
  onStartDelete,
  onStartEdit,
}: ItemCardProps) => {
  const handleSelect = (from: "title" | "card") => {
    if (from === "title" && isEditable) {
      onItemSelect(item);
    }
    if (from === "card" && !isEditable) {
      onItemSelect(item);
    }
  };

  const handleStartEdit = () => onStartEdit?.(item.id);
  const handleStartDelete = () => onStartDelete?.(item.id);

  return (
    <div
      onClick={() => handleSelect("card")}
      className={`bg-tertiary rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 ${
        !isEditable && "cursor-pointer hover:bg-tertiary-hover"
      }`}
    >
      <img
        src={item.imageUrl}
        alt={item.name}
        className="w-full h-60 object-contain rounded-md mb-3"
      />
      <div
        className={` flex ${isEditable ? "justify-between" : "justify-center"}`}
      >
        <h3
          className={`text-lg font-semibold ${
            isEditable && "hover:underline cursor-pointer"
          }`}
          onClick={() => handleSelect("title")}
        >
          {item.name}
        </h3>
        {isEditable && (
          <EditButtons onEdit={handleStartEdit} onDelete={handleStartDelete} />
        )}
      </div>
    </div>
  );
};

export default ItemCard;
