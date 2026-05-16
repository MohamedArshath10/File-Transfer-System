import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { ShareLink } from './share-link.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.files)
  user: User;

  @Column()
  original_name: string;

  @Column()
  cloudinary_url: string;

  @Column()
  cloudinary_public_id: string;

  @Column()
  size: number;

  @Column()
  mime_type: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => ShareLink, link => link.file)
  shareLinks: ShareLink[];
}