import { Set, Router, Route } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Route path="/" page={HomePage} name="home" />
      <Set wrap={ScaffoldLayout} title="Follows" titleTo="follows" buttonLabel="New Follow" buttonTo="newFollow">
        <Route path="/follows/new" page={FollowNewFollowPage} name="newFollow" />
        <Route path="/follows/{id:Int}/edit" page={FollowEditFollowPage} name="editFollow" />
        <Route path="/follows/{id:Int}" page={FollowFollowPage} name="follow" />
        <Route path="/follows" page={FollowFollowsPage} name="follows" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Likes" titleTo="likes" buttonLabel="New Like" buttonTo="newLike">
        <Route path="/likes/new" page={LikeNewLikePage} name="newLike" />
        <Route path="/likes/{id:Int}/edit" page={LikeEditLikePage} name="editLike" />
        <Route path="/likes/{id:Int}" page={LikeLikePage} name="like" />
        <Route path="/likes" page={LikeLikesPage} name="likes" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Comments" titleTo="comments" buttonLabel="New Comment" buttonTo="newComment">
        <Route path="/comments/new" page={CommentNewCommentPage} name="newComment" />
        <Route path="/comments/{id:Int}/edit" page={CommentEditCommentPage} name="editComment" />
        <Route path="/comments/{id:Int}" page={CommentCommentPage} name="comment" />
        <Route path="/comments" page={CommentCommentsPage} name="comments" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Users" titleTo="users" buttonLabel="New User" buttonTo="newUser">
        <Route path="/users/new" page={UserNewUserPage} name="newUser" />
        <Route path="/users/{id:Int}/edit" page={UserEditUserPage} name="editUser" />
        <Route path="/users/{id:Int}" page={UserUserPage} name="user" />
        <Route path="/users" page={UserUsersPage} name="users" />
      </Set>
      <Set wrap={ScaffoldLayout} title="Posts" titleTo="posts" buttonLabel="New Post" buttonTo="newPost">
        <Route path="/posts/new" page={PostNewPostPage} name="newPost" />
        <Route path="/posts/{id:Int}/edit" page={PostEditPostPage} name="editPost" />
        <Route path="/posts/{id:Int}" page={PostPostPage} name="post" />
        <Route path="/posts" page={PostPostsPage} name="posts" />
      </Set>
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
