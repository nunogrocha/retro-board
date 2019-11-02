import 'reflect-metadata';
import { createConnection } from 'typeorm';
import {
  SessionRepository,
  PostRepository,
  ColumnRepository,
} from './repositories';
import {
  Session as JsonSession,
  Post as JsonPost,
  ColumnDefinition as JsonColumnDefintion,
  SessionOptions,
  defaultOptions,
  defaultSession,
} from 'retro-board-common';
import { Store } from '../types';
import getOrmConfig from './orm-config';

export async function getDb() {
  const connection = await createConnection(getOrmConfig());
  return connection;
}

const create = (sessionRepository: SessionRepository) => async (
  id: string,
  options: SessionOptions,
  columns: JsonColumnDefintion[]
) => {
  try {
    const session = await sessionRepository.findOne({ id });
    if (!session) {
      await sessionRepository.saveFromJson({
        ...defaultSession,
        id,
        ...options,
        columns,
      });
    }
  } catch (err) {
    throw err;
  }
};

const get = (
  sessionRepository: SessionRepository,
  postRepository: PostRepository,
  columnRepository: ColumnRepository
) => async (sessionId: string): Promise<JsonSession> => {
  try {
    const session = await sessionRepository.findOne({ id: sessionId });
    if (session) {
      const posts = (await postRepository.find({
        where: { session },
        order: { created: 'ASC' },
      })) as JsonPost[];
      const columns = (await columnRepository.find({
        where: { session },
        order: { index: 'ASC' },
      })) as JsonColumnDefintion[];
      return {
        ...session,
        columns,
        posts,
      };
    } else {
      return {
        ...defaultSession,
        id: sessionId,
      };
    }
  } catch (err) {
    throw err;
  }
};

const saveSession = (sessionRepository: SessionRepository) => async (
  session: JsonSession
): Promise<void> => {
  await sessionRepository.saveFromJson(session);
};

const savePost = (postRepository: PostRepository) => async (
  sessionId: string,
  post: JsonPost
): Promise<void> => {
  await postRepository.saveFromJson(sessionId, post);
};

const deletePost = (postRepository: PostRepository) => async (
  _: string,
  postId: string
): Promise<void> => {
  await postRepository.delete({ id: postId });
};

export default async function db(): Promise<Store> {
  const connection = await getDb();
  const sessionRepository = await connection.getCustomRepository(
    SessionRepository
  );
  const postRepository = await connection.getCustomRepository(PostRepository);
  const columnRepository = await connection.getCustomRepository(
    ColumnRepository
  );
  return {
    get: get(sessionRepository, postRepository, columnRepository),
    saveSession: saveSession(sessionRepository),
    savePost: savePost(postRepository),
    deletePost: deletePost(postRepository),
    create: create(sessionRepository),
  };
}