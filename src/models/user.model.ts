import {
  Column,
  Table,
  Model,
  Unique,
  AllowNull,
  DataType,
  BeforeCreate,
  BeforeUpdate,
  Default,
} from 'sequelize-typescript';
import { hash } from 'bcrypt';
import { UserRoles } from 'src/libs/utils/constants/enums';

interface UserAttributes {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UserCreationAttributes {
  name: string;
  email: string;
  password: string;
  role: string;
}

@Table({
  tableName: 'users',
})
export class User extends Model<UserAttributes, UserCreationAttributes> {
  @AllowNull(false)
  @Column
  declare name: string;

  @AllowNull(false)
  @Unique
  @Column
  declare email: string;

  @AllowNull(false)
  @Column
  declare password: string;

  @AllowNull(false)
  @Default(UserRoles.USER)
  @Column(DataType.STRING)
  declare role: UserRoles;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.changed('password')) {
      const hashedPassword: string = await hash(user.password, 10);
      user.password = hashedPassword;
    }
  }
}
