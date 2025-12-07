import EditPostLikeCell from 'src/components/PostLike/EditPostLikeCell'

type PostLikePageProps = {
  id: number
}

const EditPostLikePage = ({ id }: PostLikePageProps) => {
  return <EditPostLikeCell id={id} />
}

export default EditPostLikePage
