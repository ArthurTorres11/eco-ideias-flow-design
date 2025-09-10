
import { Leaf, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-green-700" />
          <h1 className="text-xl font-bold text-gray-800">Eco-Ideias</h1>
        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-green-100 text-green-700">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-sm text-gray-600">{user?.name}</span>
          <Button
            onClick={async () => {
              await logout();
              navigate("/");
            }}
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
