/*
  Warnings:

  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum("users_role")` to `Enum("users_role")`.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('CUSTOMER', 'NUTRI', 'ADMIN') NOT NULL DEFAULT 'CUSTOMER';
