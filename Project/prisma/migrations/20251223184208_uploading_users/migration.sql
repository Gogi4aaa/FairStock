-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password_hash` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `full_name` VARCHAR(191) NULL,
    `investor_category` VARCHAR(191) NULL,
    `questionnaire_completed` BOOLEAN NOT NULL DEFAULT false,
    `questionnaire_answers` JSON NULL,
    `risk_score` INTEGER NULL,
    `watchlist` JSON NOT NULL,
    `recently_viewed` JSON NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
