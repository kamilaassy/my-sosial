import Feed from 'src/components/Feed/Feed'
// import CreatePostTrigger from 'src/components/PostComposer/CreatePostTrigger'
import PostComposerModal from 'src/components/PostComposer/PostComposerModal'

const HomePage = () => {
  return (
    <>
      {/* Trigger untuk membuka composer modal */}
      {/* <CreatePostTrigger /> */}

      {/* Composer modal (selalu render, tetapi opened = false saat idle) */}
      <PostComposerModal />

      {/* Feed list */}
      <Feed />
    </>
  )
}

export default HomePage
