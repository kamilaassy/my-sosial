import LikeCell from 'src/components/Like/LikeCell'

type LikePageProps = {
  id: number
}

const LikePage = ({ id }: LikePageProps) => {
  return <LikeCell id={id} />
}

export default LikePage
