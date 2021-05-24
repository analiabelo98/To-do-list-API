import {
  Entity, Column, PrimaryGeneratedColumn, ManyToMany, 
  BaseEntity, JoinTable, ManyToOne
} from 'typeorm';
import {Users} from "./Users";

@Entity()
export class Task extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

 @ManyToOne(() => Users, user => user.tasks)
    user: Users["id"];
  
}