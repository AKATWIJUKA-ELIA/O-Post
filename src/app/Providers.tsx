import ReduxProvider from "./ReduxProvider";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
        return( 
        <ReduxProvider>
        {children}
        </ReduxProvider>
        )
}