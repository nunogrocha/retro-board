import {
  Entity,
  Column,
  PrimaryColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { AccountType } from 'retro-board-common';
import { SessionTemplate } from '.';
import bcrypt from 'bcrypt';
import config from '../config';

@Entity({ name: 'users' })
@Index(['username', 'accountType'], { unique: true })
export default class User {
  @PrimaryColumn({ primary: true, generated: false, unique: true })
  public id: string;
  @Column()
  @Index()
  public name: string;
  @Column({ default: 'anonymous' })
  public accountType: AccountType;
  @Column({ nullable: true, type: 'character varying' })
  public username: string | null;
  @Column({ nullable: true, type: 'character varying' })
  public password: string | null;
  @Column({ nullable: true, type: 'character varying' })
  public photo: string | null;
  @Column({ nullable: false, type: 'character varying', default: 'en' })
  public language: string;
  @ManyToOne(() => SessionTemplate, { nullable: true, eager: false })
  public defaultTemplate: SessionTemplate | null | undefined;
  @CreateDateColumn({ type: 'timestamp with time zone' })
  public created: Date | undefined;
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  public updated: Date | undefined;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
    this.language = 'en';
    this.accountType = 'anonymous';
    this.password = null;
    this.username = null;
    this.photo = null;
  }

  public async setPassword(password: string): Promise<void> {
    const hashed = await bcrypt.hash(password, config.BCRYPT_SALT);
    this.password = hashed;
  }

  public async checkPassword(password: string): Promise<boolean> {
    if (!this.password) {
      return false;
    }
    const result = await bcrypt.compare(password, this.password);
    return result;
  }
}
