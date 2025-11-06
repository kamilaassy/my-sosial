import FollowCell from 'src/components/Follow/FollowCell'

type FollowPageProps = {
  id: number
}

const FollowPage = ({ id }: FollowPageProps) => {
  return <FollowCell id={id} />
}

export default FollowPage
