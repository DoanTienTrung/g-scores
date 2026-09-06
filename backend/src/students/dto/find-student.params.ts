import { Matches } from 'class-validator';

export class FindStudentParams {
  /** Every registration number in the dataset is exactly 8 digits. */
  @Matches(/^\d{8}$/, {
    message: 'Số báo danh phải gồm đúng 8 chữ số',
  })
  sbd!: string;
}
