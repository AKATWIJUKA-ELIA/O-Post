import ReduxProvider from "./ReduxProvider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { NotificationProvider } from "@/app/NotificationContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
        return( 
                <NotificationProvider>
        <ConvexClientProvider>
        <ReduxProvider>
        {children}
        </ReduxProvider>
        </ConvexClientProvider>
        </NotificationProvider>
        )
}