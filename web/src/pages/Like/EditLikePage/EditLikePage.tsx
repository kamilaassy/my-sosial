import EditLikeCell from 'src/components/Like/EditLikeCell'

type LikePageProps = {
  id: number
}

const EditLikePage = ({ id }: LikePageProps) => {
  return <EditLikeCell id={id} />
}

export default EditLikePage
