/* eslint-disable react/prop-types */
import { AlignJustify, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

function AdminHeader({ setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleLogout() {
    dispatch(logoutUser())
      .then((response) => {
        if (response?.payload?.success) {
          toast({
            title: "Logged out successfully",
          });
          navigate("/shop/home");
        } else {
          toast({
            title: "Logout failed",
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        toast({
          title: "Logout failed",
          variant: "destructive", 
        });
      });
  }

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-background border-b">
      <Button onClick={() => setOpen(true)} className="lg:hidden sm:block">
        <AlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
