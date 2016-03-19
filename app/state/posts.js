import uuid from 'node-uuid';

export const ADD_POST = 'ADD_POST';
export const ADD_TEST_DATA = 'ADD_TEST_DATA';
export const RECEIVE_POST = 'RECEIVE_POST';
export const RECEIVE_BOARD = 'RECEIVE_BOARD';

export default function reducer(state = [], action) {
    switch (action.type) {
        case ADD_POST:
        case RECEIVE_POST:
            return [
                ...state, {
                    postType: action.data.postType,
                    content: action.data.content,
                    user: action.data.user,
                    id: action.data.id
                }
            ];
        case RECEIVE_BOARD:
            return action.data;
        default:
            return state;
    }
}

export const addPost = (postType, content) => (dispatch, getState) => {
    const state = getState();

    dispatch({
        type: ADD_POST,
        data: {
            postType,
            content,
            user: state.user.name,
            sessionId: state.session.id,
            id: uuid.v1()
        }
    });
}
