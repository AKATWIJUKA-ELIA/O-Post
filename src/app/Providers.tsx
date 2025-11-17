"use client";
import ReduxProvider from "./ReduxProvider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import {ConvexQueryCacheProvider} from "convex-helpers/react/cache"
import { NotificationProvider } from "@/app/NotificationContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
        return( 
                <NotificationProvider>
        <ConvexClientProvider>
                <ConvexQueryCacheProvider>
        <ReduxProvider>
        {children}
        </ReduxProvider>
        </ConvexQueryCacheProvider>
        </ConvexClientProvider>
        </NotificationProvider>
        )
}