import { Type } from 'class-transformer';
import { IsEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, IsEnum } from '@/global/swagger';


export enum IsEncryptEnum {
  TRUE = 1,
  FALSE = 0,
}

export class AdminLoginDTO {
  @ApiProperty({
    description: '用户名',
  })
  @MinLength(4, { message: '用户名长度不能少于4位' })
  @MaxLength(20, { message: '用户名长度不能大于20位' })
  username: string;

  @ApiProperty({
    description: '密码',
  })
  @MinLength(5, { message: '密码长度不能少于5位' })
  @MaxLength(30, { message: '密码长度不能大于30位' })
  password: string;

  @ApiProperty({
    enum: IsEncryptEnum,
    description: '是否使用加密方式登陆',
  })
  @Type(() => Number)
  @IsEnum(IsEncryptEnum, { message: '无效的登陆方式' })
  encrypt: IsEncryptEnum = IsEncryptEnum.TRUE;
}
