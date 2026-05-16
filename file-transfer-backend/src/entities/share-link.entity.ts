import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { File } from './file.entity';
import { DownloadLog } from './download-log.entity';

@Entity('share_links')
export class ShareLink {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => File, file => file.shareLinks)
  file: File;

  @Column({ unique: true })
  token: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  expires_at: Date;

  @Column({ default: 0 })
  download_count: number;

  @Column({ nullable: true })
  max_downloads: number;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => DownloadLog, log => log.shareLink)
  downloadLogs: DownloadLog[];
}