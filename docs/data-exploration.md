# Khám phá dữ liệu

Phân tích trước khi thiết kế schema. Chạy lại: `node scripts/explore-dataset.mjs`

## Tổng quan

| | |
|---|---|
| File nguồn | `diem_thi_thpt_2024.csv`, 42.125.478 byte |
| Lưu trong repo | gzip 8,73 MB (21,7%) |
| Số dòng | 1.061.605 |
| Số cột | 11 (`sbd` + 9 môn + `ma_ngoai_ngu`) |
| Script chạy hết | 1,72s |

## Thống kê từng môn

| Môn | Có điểm | Ô trống | Min | Max |
|---|---|---|---|---|
| toan | 1.045.613 | 15.992 | 0 | 9,8 |
| ngu_van | 1.050.101 | 11.504 | 0 | 10 |
| ngoai_ngu | 912.705 | 148.900 | 0 | 10 |
| vat_li | 345.615 | 715.990 | 0 | 10 |
| hoa_hoc | 346.518 | 715.087 | 0 | 10 |
| sinh_hoc | 342.378 | 719.227 | 0 | 10 |
| lich_su | 706.214 | 355.391 | 0 | 10 |
| dia_li | 704.682 | 356.923 | 0 | 10 |
| gdcd | 583.609 | 477.996 | 0 | 10 |

## Số báo danh

1.061.605 giá trị phân biệt, bằng đúng số dòng nên không có trùng lặp.
Độ dài luôn là 8. Có số 0 đứng đầu (`01000001`).

## Mã ngoại ngữ

`N1` đến `N7`. 148.900 thí sinh bỏ trống.

## Độ chính xác thập phân

55 phần thập phân phân biệt. **Không ô nào quá 2 chữ số.**

| Bước chấm | Phần thập phân | Số ô |
|---|---|---|
| 0,25 | `.0 .25 .5 .75` | ~4,47 tr |
| 0,2 | `.2 .4 .6 .8` | ~1,57 tr |
| khác | 47 giá trị còn lại | ~3.100 |

## Khối A (toan + vat_li + hoa_hoc)

343.800 thí sinh có đủ 3 môn (32,4%).

| Tổng | Số thí sinh | Cộng dồn |
|---|---|---|
| 29,60 | 1 | 1 |
| 29,55 | 1 | 2 |
| 29,35 | 1 | 3 |
| 29,30 | 3 | 6 |
| 29,20 | 3 | 9 |
| **29,15** | **8** | **17** |

## Ảnh hưởng tới schema

- `sbd` làm primary key được: 1.061.605 giá trị phân biệt trên đúng 1.061.605 dòng, độ dài
  cố định 8. Lưu dạng chuỗi, vì số 0 đứng đầu sẽ mất nếu để kiểu số.
- Cột điểm dùng `Decimal(4,2)`. Đã đếm, 0 ô nào quá 2 chữ số thập phân nên scale 2 là đủ.
  Không dùng `Float` vì điểm là số thập phân chính xác, giống tiền.
- Cả 9 cột điểm phải nullable. Ít ô trống nhất là `ngu_van` (11.504), nhiều nhất `sinh_hoc`
  (719.227). Ô trống nghĩa là không dự thi, khác với điểm 0. Dữ liệu có cả hai.
- `ma_ngoai_ngu`: chuỗi ngắn, nullable.

## Bất thường

- Có một bước chấm thứ ba, khoảng 3.100 ô (0,03%). Các phần thập phân
  `.08 .17 .33 .42 .58 .67 .83 .92` là phân số phần mười hai làm tròn 2 số:
  1/12 = 0,0833 → `.08`, 7/12 = 0,5833 → `.58`. Nhóm `.16 .41 .66 .91` cũng là mấy phân số đó
  nhưng cắt cụt chứ không làm tròn, tức là nguồn dữ liệu trộn ít nhất 2 quy ước.
  Vẫn nằm trong 2 chữ số nên `Decimal(4,2)` lưu được.
- Toán không có điểm 10. Cao nhất 9,8, có 43 thí sinh. Tám môn kia đều chạm 10.
- Min = 0 ở cả 9 môn. Ban đầu nghi là lỗi phân tích, vì `Number('')` trong JS ra `0`.
  Kiểm lại bằng cách đếm ô không rỗng mà bằng 0: `toan` được 1, `dia_li` được 59. Quá ít và
  quá lệch nhau để là ô trống lọt qua, riêng `toan` đã có 15.992 ô trống. Là dữ liệu thật.
- Hạng 10 khối A không xác định được nếu chỉ sắp theo tổng điểm. Top 9 rõ ràng, nhưng hạng 10
  nằm trong nhóm 8 người cùng 29,15. Cần tiêu chí sắp xếp phụ, không thì thứ tự trả về
  không ổn định.
