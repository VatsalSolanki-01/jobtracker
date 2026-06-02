package models

type Application struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	CompanyName string `json:"company_name"`
	JobRole     string `json:"job_role"`
	Status      string `json:"status"`
}