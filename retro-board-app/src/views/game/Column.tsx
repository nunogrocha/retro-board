import React, { SFC, useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  Input,
  InputAdornment,
  makeStyles,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Typography,
} from '@material-ui/core';
import { CreateNewFolder, Visibility, VisibilityOff } from '@material-ui/icons';
import PostItem from './post/Post';
import { Post, PostGroup, SessionOptions } from 'retro-board-common';
import useUser from '../../auth/useUser';
import useTranslations from '../../translations';
import Group from './Group';
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { ColumnContent } from './types';
import { values } from 'lodash';

interface ColumnProps {
  column: ColumnContent;
  posts: Post[];
  groups: PostGroup[];
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | null;
  question: string;
  color: string;
  options: SessionOptions;
  onAdd: (content: string) => void;
  onAddGroup: () => void;
  onEditGroup: (group: PostGroup) => void;
  onDeleteGroup: (group: PostGroup) => void;
  onLike: (post: Post) => void;
  onDislike: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
}

const useStyles = makeStyles({
  icon: {
    color: 'grey',
  },
});

const Column: SFC<ColumnProps> = ({
  column,
  options,
  posts,
  groups,
  icon: Icon,
  question,
  color,
  onAdd,
  onAddGroup,
  onLike,
  onDislike,
  onEdit,
  onDelete,
  onEditGroup,
  onDeleteGroup,
}) => {
  const user = useUser();
  const isLoggedIn = !!user;
  const { Column: columnTranslations } = useTranslations();
  const [content, setContent] = useState('');
  const onContentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value),
    [setContent]
  );
  const classes = useStyles();
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.keyCode === 13 && content) {
        onAdd(content);
        setContent('');
      }
    },
    [onAdd, setContent, content]
  );
  return (
    <ColumnWrapper>
      <CenterText>
        <Typography variant="overline" gutterBottom>
          {question}
        </Typography>
      </CenterText>
      <Card>
        <CardContent>
          <Add>
            <FormControl>
              <InputLabel htmlFor="component-simple">{question}</InputLabel>
              <Input
                placeholder='Press ENTER to submit'
                onChange={onContentChange}
                value={content}
                onKeyDown={onKeyDown}
                readOnly={!isLoggedIn}
              />
            </FormControl>
          </Add>
        </CardContent>
        <CardActions>
          <AddGroupCentered>
            {options.allowGrouping && isLoggedIn ? (
              <Button
              color="primary"
              onClick={onAddGroup}
              tabIndex={-1}
              startIcon={<CreateNewFolder />}>
                {columnTranslations.createGroupTooltip!}
              </Button>
            ) : null}
          </AddGroupCentered>
        </CardActions>
      </Card>
      
      <Groups>
        {groups.map((group) => (
          <Group
            key={group.id}
            group={group}
            readonly={false}
            onEditLabel={(label) =>
              onEditGroup({
                ...group,
                label,
              })
            }
            onDelete={() => onDeleteGroup(group)}
          >
            {group.posts.map((post, index) => (
              <PostItem
                index={index}
                key={post.id}
                post={post}
                color={color}
                onLike={() => onLike(post)}
                onDislike={() => onDislike(post)}
                onDelete={() => onDelete(post)}
                onEdit={(content) =>
                  onEdit({
                    ...post,
                    content,
                  })
                }
                onEditAction={(action) =>
                  onEdit({
                    ...post,
                    action,
                  })
                }
                onEditGiphy={(giphy) =>
                  onEdit({
                    ...post,
                    giphy,
                  })
                }
                allowDownVotes={options.allowDownVotes}
              />
            ))}
          </Group>
        ))}
      </Groups>
      <Droppable droppableId={'column#' + column.index} isCombineEnabled>
        {(
          dropProvided: DroppableProvided,
          dropSnapshot: DroppableStateSnapshot
        ) => (
          <PostsWrapper
            ref={dropProvided.innerRef}
            {...dropProvided.droppableProps}
            draggingOver={dropSnapshot.isDraggingOver}
            draggingColor={column.color}
          >
            {posts.map((post, index) => (
              <PostItem
                index={index}
                key={post.id}
                post={post}
                color={color}
                onLike={() => onLike(post)}
                onDislike={() => onDislike(post)}
                onDelete={() => onDelete(post)}
                onEdit={(content) =>
                  onEdit({
                    ...post,
                    content,
                  })
                }
                onEditAction={(action) =>
                  onEdit({
                    ...post,
                    action,
                  })
                }
                onEditGiphy={(giphy) =>
                  onEdit({
                    ...post,
                    giphy,
                  })
                }
                allowDownVotes={options.allowDownVotes}
              />
            ))}
          </PostsWrapper>
        )}
      </Droppable>
    </ColumnWrapper>
  );
};


// const InnerList = React.memo(({posts}) => {
//   return posts.map((post, index) => (<p>{post.id}</p>))
// })

// const InnerList = React.memo(function InnerList(props: students: Person[]) {
//   return posts.map((post, index) => (
//     <PostItem
//       index={index}
//       key={post.id}
//       post={post}
//       color={color}
//       onLike={() => onLike(post)}
//       onDislike={() => onDislike(post)}
//       onDelete={() => onDelete(post)}
//       onEdit={(content) =>
//         onEdit({
//           ...post,
//           content,
//         })
//       }
//       onEditAction={(action) =>
//         onEdit({
//           ...post,
//           action,
//         })
//       }
//       onEditGiphy={(giphy) =>
//         onEdit({
//           ...post,
//           giphy,
//         })
//       }
//       allowDownVotes={options.allowDownVotes}
//     />
//   ))
// });

const ColumnWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-bottom: 10px;
  padding: 0 5px;
`;

const PostsWrapper = styled.div<{
  draggingOver: boolean;
  draggingColor: string;
}>`
  background-color: ${(props) =>
    props.draggingOver ? props.draggingColor : 'unset'};
  flex: 1;
  min-height: 100px;
`;

const Groups = styled.div``;

const Add = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  > :first-child {
    flex: 1;
    input {
      width: 100%;
    }
  }
`;

const AddGroupCentered = styled.div`
  display: flex;
  align-items: center;
`;

const CenterText = styled.div`
  text-align: center;
`;

const AddGroup = styled.div`
  position: relative;
  top: 3px;
`;

export default Column;
