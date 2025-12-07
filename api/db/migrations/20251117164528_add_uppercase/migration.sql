-- RenameIndex
ALTER TABLE `comment` RENAME INDEX `Comment_authorId_fkey` TO `Comment_authorId_idx`;

-- RenameIndex
ALTER TABLE `comment` RENAME INDEX `Comment_postId_fkey` TO `Comment_postId_idx`;

-- RenameIndex
ALTER TABLE `follow` RENAME INDEX `Follow_followingId_fkey` TO `Follow_followingId_idx`;

-- RenameIndex
ALTER TABLE `post` RENAME INDEX `Post_authorId_fkey` TO `Post_authorId_idx`;
