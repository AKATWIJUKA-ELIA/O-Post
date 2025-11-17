import { useAppDispatch } from "@/hooks";
import { DeleteUser } from "@/store/postUser";
import { useRouter } from "next/navigation";
import { useNotification } from "@/app/NotificationContext";

const useLogout = () => {
        const router = useRouter();
        const { setNotification } = useNotification();
  const dispatch = useAppDispatch();
   const LogOut = async ()=>{
                try {
                        const response = await fetch('/api/logout', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                        });
                        if (!response.ok) {
                                 
                                throw new Error('Failed to delete session');
                        }
                        const data = await response.json();
                        if(data?.success){
                                setNotification({ status: 'success', message: data.message || 'Logged out successfully' });
                                router.push(data.redirect || '/');
                        }
                        return data;
                        
                } catch (error) {
                        console.error('Error during session deletion:', error);
                }
        }
        
  const logoutAndClearUser = async () => {
    dispatch(DeleteUser());
    return LogOut();
  };

  return {
    LogOut: logoutAndClearUser
  };
};

export default useLogout;