-- CreateTable
CREATE TABLE "exam_results" (
    "sbd" VARCHAR(8) NOT NULL,
    "toan" DECIMAL(4,2),
    "ngu_van" DECIMAL(4,2),
    "ngoai_ngu" DECIMAL(4,2),
    "vat_li" DECIMAL(4,2),
    "hoa_hoc" DECIMAL(4,2),
    "sinh_hoc" DECIMAL(4,2),
    "lich_su" DECIMAL(4,2),
    "dia_li" DECIMAL(4,2),
    "gdcd" DECIMAL(4,2),
    "ma_ngoai_ngu" VARCHAR(2),

    CONSTRAINT "exam_results_pkey" PRIMARY KEY ("sbd")
);

-- CreateTable
CREATE TABLE "subject_statistics" (
    "subject" VARCHAR(20) NOT NULL,
    "level" SMALLINT NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "subject_statistics_pkey" PRIMARY KEY ("subject","level")
);
