import { Matches } from 'class-validator';

/**
 * Route parameters for GET /api/students/:sbd.
 * The pattern is what Phase 1 measured: every registration number in the
 * dataset is exactly 8 digits, leading zeros included.
 */
export class FindStudentParams {
  @Matches(/^\d{8}$/, {
    message: 'Số báo danh phải gồm đúng 8 chữ số',
  })
  sbd!: string;
}
