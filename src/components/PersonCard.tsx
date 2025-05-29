// components/PersonCard.tsx
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

type Person = {
  id: number;
  name: string;
  description: string;
  photoUrl?: string;
};

type Props = {
  person: Person;
  isAdmin?: boolean;
  onEdit?: (person: Person) => void;
  onDelete?: (id: number) => void;
};

const PersonCard = ({ person, isAdmin, onEdit, onDelete }: Props) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-3">
        <Image
          src={person.photoUrl || "/placeholder.svg"}
          alt={person.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          width={256}
          height={256}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 p-0 bg-black/50 border-gray-600 hover:bg-black/70"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(person);
                }}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 p-0 bg-black/50 border-gray-600 hover:bg-red-600/70"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(person.id);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-lg group-hover:text-gray-300 transition-colors">
          {person.name}
        </h3>
        <p className="text-gray-400 text-sm">{person.description}</p>
      </div>
    </div>
  );
};

export default PersonCard;
