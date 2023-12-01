'use client'

import { SessionProvider as Provider } from 'next-auth/react'

type Props = {
    children: React.ReactNode
}

type Provider = {
    session: any
}

export default function SessionProvider({ children }: Props) {
    return (
        <Provider>
            {children}
        </Provider>
    )
}