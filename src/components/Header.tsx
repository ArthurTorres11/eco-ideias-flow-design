
import { Leaf } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-green-700" />
          <h1 className="text-xl font-bold text-gray-800">Eco-Ideias</h1>
        </div>
        <Avatar>
          <AvatarFallback className="bg-green-100 text-green-700">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Header;
