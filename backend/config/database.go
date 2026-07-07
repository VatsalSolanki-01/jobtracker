package config

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/VatsalSolanki-01/jobtracker/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	_ = godotenv.Load()

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	var err error

	for i := 1; i <= 15; i++ {
		DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Printf(
				"Database connection attempt %d failed while opening DB: %v. Retrying in 5 seconds...",
				i,
				err,
			)
			time.Sleep(5 * time.Second)
			continue
		}

		sqlDB, sqlErr := DB.DB()
		if sqlErr != nil {
			log.Printf(
				"Database connection attempt %d failed while getting sql.DB: %v. Retrying in 5 seconds...",
				i,
				sqlErr,
			)
			time.Sleep(5 * time.Second)
			continue
		}

		pingErr := sqlDB.Ping()
		if pingErr != nil {
			log.Printf(
				"Database connection attempt %d failed while pinging DB: %v. Retrying in 5 seconds...",
				i,
				pingErr,
			)
			time.Sleep(5 * time.Second)
			continue
		}

		log.Println("Database connected successfully")
		break
	}

	if err != nil {
		log.Fatalf("Database connection failed after multiple attempts: %v", err)
	}

	err = DB.AutoMigrate(
		&models.User{},
		&models.Application{},
	)

	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}

	log.Println("Database migration completed successfully")
}