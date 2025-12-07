import PostLikeCell from 'src/components/PostLike/PostLikeCell'

type PostLikePageProps = {
  id: number
}

const PostLikePage = ({ id }: PostLikePageProps) => {
  return <PostLikeCell id={id} />
}

export default PostLikePage
