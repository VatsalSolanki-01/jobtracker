package models

type Application struct {
	ID          int    `json:"id"`
	CompanyName string `json:"company_name"`
	JobRole     string `json:"job_role"`
	Status      string `json:"status"`
}