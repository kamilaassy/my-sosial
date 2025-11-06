import type {
  DeleteFollowMutation,
  DeleteFollowMutationVariables,
  FindFollows,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Follow/FollowsCell'
import { timeTag, truncate } from 'src/lib/formatters'

const DELETE_FOLLOW_MUTATION: TypedDocumentNode<
  DeleteFollowMutation,
  DeleteFollowMutationVariables
> = gql`
  mutation DeleteFollowMutation($id: Int!) {
    deleteFollow(id: $id) {
      id
    }
  }
`

const FollowsList = ({ follows }: FindFollows) => {
  const [deleteFollow] = useMutation(DELETE_FOLLOW_MUTATION, {
    onCompleted: () => {
      toast.success('Follow deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteFollowMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete follow ' + id + '?')) {
      deleteFollow({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Follower id</th>
            <th>Following id</th>
            <th>Created at</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {follows.map((follow) => (
            <tr key={follow.id}>
              <td>{truncate(follow.id)}</td>
              <td>{truncate(follow.followerId)}</td>
              <td>{truncate(follow.followingId)}</td>
              <td>{timeTag(follow.createdAt)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.follow({ id: follow.id })}
                    title={'Show follow ' + follow.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.editFollow({ id: follow.id })}
                    title={'Edit follow ' + follow.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete follow ' + follow.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(follow.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default FollowsList
