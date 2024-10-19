'use client';

import Loader from '@/components/Loader'
import { getClerkUsers, getDocumentUsers } from '@/lib/actions/user.action'
import { useUser } from '@clerk/nextjs'
import { LiveblocksProvider, ClientSideSuspense } from '@liveblocks/react/suspense'
import { ReactNode } from 'react';

const Provider = ({ children }: { children: ReactNode }) => {
  const { user: clerkUser } = useUser()
  if(!clerkUser) return

  return (
    <LiveblocksProvider 
      authEndpoint="/api/liveblocks-auth" 
      resolveUsers={async({userIds}) => {
        const users = await getClerkUsers({userIds: userIds})
        return users
      }}
      resolveMentionSuggestions={async({ text, roomId }) => {
        const roomUsers = await getDocumentUsers({ roomId, currentUser: clerkUser.emailAddresses[0].emailAddress!, text })
        return roomUsers
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {children}
      </ClientSideSuspense>
  </LiveblocksProvider>
  )
}

//publicApiKey={"pk_dev_GDVCs…TL4KYG"}

export default Provider