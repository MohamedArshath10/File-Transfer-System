import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ShareLink } from './share-link.entity';

@Entity('download_logs')
export class DownloadLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ShareLink, link => link.downloadLogs)
  shareLink: ShareLink;

  @Column({ nullable: true })
  ip_address: string;

  @CreateDateColumn()
  downloaded_at: Date;
}