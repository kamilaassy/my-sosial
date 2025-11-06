import EditFollowCell from 'src/components/Follow/EditFollowCell'

type FollowPageProps = {
  id: number
}

const EditFollowPage = ({ id }: FollowPageProps) => {
  return <EditFollowCell id={id} />
}

export default EditFollowPage
