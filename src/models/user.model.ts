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
  resetPasswordOtp?: string | null;
  resetPasswordOtpExpiresAt?: Date | null;
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

  @Default(UserRoles.CUSTOMER)
  @Column(DataType.STRING)
  declare role: UserRoles;

  @Column(DataType.STRING)
  declare resetPasswordOtp: string | null;

  @Column(DataType.DATE)
  declare resetPasswordOtpExpiresAt: Date | null;

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: User) {
    if (user.changed('password')) {
      const hashedPassword: string = await hash(user.password, 10);
      user.password = hashedPassword;
    }
  }
}
