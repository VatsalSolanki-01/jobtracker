package routes

import (
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/VatsalSolanki-01/jobtracker/config"
	"github.com/VatsalSolanki-01/jobtracker/models"
	"github.com/gin-gonic/gin"
)

type ApplicationInput struct {
	CompanyName string `json:"company_name"`
	JobRole     string `json:"job_role"`
	Status      string `json:"status"`
	AppliedDate string `json:"applied_date"`
}

func CreateApplication(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized user",
		})
		return
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user context",
		})
		return
	}

	var input ApplicationInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	input.CompanyName = strings.TrimSpace(input.CompanyName)
	input.JobRole = strings.TrimSpace(input.JobRole)
	input.Status = strings.TrimSpace(input.Status)
	input.AppliedDate = strings.TrimSpace(input.AppliedDate)

	if input.CompanyName == "" || input.JobRole == "" || input.Status == "" || input.AppliedDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Company name, job role, status, and applied date are required",
		})
		return
	}

	appliedDate, err := time.Parse("2006-01-02", input.AppliedDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Applied date must be in YYYY-MM-DD format",
		})
		return
	}

	application := models.Application{
		CompanyName: input.CompanyName,
		JobRole:     input.JobRole,
		Status:      input.Status,
		UserID:      userID,
		AppliedDate: &appliedDate,
	}

	if err := config.DB.Create(&application).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save application",
		})
		return
	}

	c.JSON(http.StatusCreated, application)
}

func GetApplications(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized user",
		})
		return
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user context",
		})
		return
	}

	var applications []models.Application

	result := config.DB.
		Where("user_id = ?", userID).
		Order("applied_date desc").
		Find(&applications)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch applications",
		})
		return
	}

	c.JSON(http.StatusOK, applications)
}

func GetApplicationByID(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized user",
		})
		return
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user context",
		})
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ID",
		})
		return
	}

	var application models.Application

	result := config.DB.
		Where("id = ? AND user_id = ?", id, userID).
		First(&application)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Application not found",
		})
		return
	}

	c.JSON(http.StatusOK, application)
}

func UpdateApplication(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized user",
		})
		return
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user context",
		})
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ID",
		})
		return
	}

	var application models.Application

	result := config.DB.
		Where("id = ? AND user_id = ?", id, userID).
		First(&application)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Application not found",
		})
		return
	}

	var input ApplicationInput

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	input.CompanyName = strings.TrimSpace(input.CompanyName)
	input.JobRole = strings.TrimSpace(input.JobRole)
	input.Status = strings.TrimSpace(input.Status)
	input.AppliedDate = strings.TrimSpace(input.AppliedDate)

	if input.CompanyName == "" || input.JobRole == "" || input.Status == "" || input.AppliedDate == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Company name, job role, status, and applied date are required",
		})
		return
	}

	appliedDate, err := time.Parse("2006-01-02", input.AppliedDate)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Applied date must be in YYYY-MM-DD format",
		})
		return
	}

	application.CompanyName = input.CompanyName
	application.JobRole = input.JobRole
	application.Status = input.Status
	application.AppliedDate = &appliedDate

	if err := config.DB.Save(&application).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update application",
		})
		return
	}

	c.JSON(http.StatusOK, application)
}

func DeleteApplication(c *gin.Context) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized user",
		})
		return
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user context",
		})
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ID",
		})
		return
	}

	var application models.Application

	result := config.DB.
		Where("id = ? AND user_id = ?", id, userID).
		First(&application)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Application not found",
		})
		return
	}

	if err := config.DB.Delete(&application).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to delete application",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Application deleted successfully",
	})
}