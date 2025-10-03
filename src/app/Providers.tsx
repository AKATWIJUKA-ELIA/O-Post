import ReduxProvider from "./ReduxProvider";
import { ConvexClientProvider } from "./ConvexClientProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
        return( 
        <ConvexClientProvider>
        <ReduxProvider>
        {children}
        </ReduxProvider>
        </ConvexClientProvider>
        )
}