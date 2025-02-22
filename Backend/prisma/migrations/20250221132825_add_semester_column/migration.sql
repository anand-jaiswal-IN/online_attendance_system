ALTER TABLE "Student" ADD COLUMN "semester" INTEGER;

-- Update existing rows with random values between 1 and 8
UPDATE "Student" SET "semester" = FLOOR(RANDOM() * 8 + 1);

-- Make semester NOT NULL after assigning values
ALTER TABLE "Student" ALTER COLUMN "semester" SET NOT NULL;
