package models

type Application struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	CompanyName string `gorm:"not null" json:"company_name"`
	JobRole     string `gorm:"not null" json:"job_role"`
	Status      string `gorm:"not null" json:"status"`
	UserID      uint   `gorm:"not null;index" json:"user_id"`
}