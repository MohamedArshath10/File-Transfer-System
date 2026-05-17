import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { File } from './file.entity';
import { DownloadLog } from './download-log.entity';

@Entity('share_links')
export class ShareLink {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => File, file => file.shareLinks, {onDelete: 'CASCADE'})
  file!: File;
  

  @Column({ unique: true })
  token!: string;

  @Column({ nullable: true, type: 'varchar' })
  password!: string | null;

  @Column({ nullable: true, type: 'timestamp' })
  expires_at!: Date | null;

  @Column({ default: 0 })
  download_count: number = 0;

  @Column({ nullable: true, type: 'int' })
  max_downloads!: number | null;

  @Column({ default: true })
  is_active: boolean = true;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => DownloadLog, log => log.shareLink)
  downloadLogs!: DownloadLog[];
}