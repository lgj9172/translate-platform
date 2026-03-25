import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  birthdate?: string;

  @IsOptional()
  @IsBoolean()
  is_age_verification?: boolean;
}

export class UpdateAgreementDto {
  @IsOptional()
  @IsBoolean()
  is_agree_privacy_policy?: boolean;

  @IsOptional()
  @IsBoolean()
  is_agree_use_policy?: boolean;

  @IsOptional()
  @IsBoolean()
  is_agree_marketing?: boolean;

  @IsOptional()
  @IsBoolean()
  is_agree_marketing_email?: boolean;

  @IsOptional()
  @IsBoolean()
  is_agree_marketing_sms?: boolean;
}
