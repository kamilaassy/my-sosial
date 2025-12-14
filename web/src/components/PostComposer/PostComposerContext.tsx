import { createContext, useContext, useState } from 'react'

import type { FeedPostDTO } from 'src/types/feed'

type ComposerCallback = (post: FeedPostDTO) => void

type ComposerContextType = {
  opened: boolean
  open: (cb?: ComposerCallback) => void
  close: () => void
  onPosted: ComposerCallback
  setOnPosted: (cb: ComposerCallback) => void
}

const ComposerContext = createContext<ComposerContextType>({
  opened: false,
  open: () => {},
  close: () => {},
  onPosted: () => {},
  setOnPosted: () => {},
})

export function PostComposerProvider({ children }) {
  const [opened, setOpened] = useState(false)
  const [onPosted, setOnPosted] = useState<ComposerCallback>(() => () => {})

  return (
    <ComposerContext.Provider
      value={{
        opened,
        open: (cb?: ComposerCallback) => {
          if (cb) setOnPosted(() => cb)
          setOpened(true)
        },
        close: () => setOpened(false),
        onPosted,
        setOnPosted,
      }}
    >
      {children}
    </ComposerContext.Provider>
  )
}

export const usePostComposer = () => useContext(ComposerContext)
