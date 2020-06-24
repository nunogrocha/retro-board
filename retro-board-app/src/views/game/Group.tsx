import React from 'react';
import { PostGroup } from 'retro-board-common';
import styled from 'styled-components';
import {
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
} from 'react-beautiful-dnd';
import { colors, IconButton, Paper } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import EditableLabel from '../../components/EditableLabel';
import { Alert, AlertTitle } from '@material-ui/lab';
import useTranslations from '../../translations';

interface GroupProps {
  group: PostGroup;
  readonly: boolean;
  onEditLabel: (label: string) => void;
  onDelete: (group: PostGroup) => void;
}

const Group: React.FC<GroupProps> = ({
  group,
  onEditLabel,
  onDelete,
  readonly,
  children,
}) => {
  const { Group: groupTranslations } = useTranslations();
  return (
    <Droppable droppableId={'group#' + group.id} key={group.id} mode="standard">
      {(
        dropProvided: DroppableProvided,
        dropSnapshot: DroppableStateSnapshot
      ) => (
        <GroupContainer
          variant="outlined"
          ref={dropProvided.innerRef}
          {...dropProvided.droppableProps}
          draggingOver={dropSnapshot.isDraggingOver}
        >
          <Header>
            <Label>
              <EditableLabel
                value={group.label}
                onChange={onEditLabel}
                readOnly={readonly}
              />
            </Label>
            <DeleteContainer>
              <IconButton onClick={() => onDelete(group)}>
                <Delete />
              </IconButton>
            </DeleteContainer>
          </Header>
          <Content>
            <div>{children}</div>
            {group.posts.length === 0 ? (
              <NoPosts>
                <Alert severity="info">
                  <AlertTitle>{groupTranslations.emptyGroupTitle}</AlertTitle>
                  {groupTranslations.emptyGroupContent}
                </Alert>
              </NoPosts>
            ) : null}
          </Content>
        </GroupContainer>
      )}
    </Droppable>
  );
};

// const GroupContainer = styled.div<{ draggingOver: boolean }>`
const GroupContainer = styled(Paper)<{ draggingOver: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  // border: 1px dashed lightgray;
  // border-radius: 10px;
  margin-top: 10px;
  // background-color: ${(props) => props.draggingOver ? colors.blue[200] : 'background-color: rgba(255,255,255,0.7)'};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colors.grey[100]};
  padding: 10px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100px;
  padding: 0 10px 10px 10px;
`;

const Label = styled.div`
  margin-left: 5px;
  flex: 1;
`;

const DeleteContainer = styled.div``;

const NoPosts = styled.div`
  justify-self: center;
  color: grey;
  margin: 30px;
`;

export default Group;
