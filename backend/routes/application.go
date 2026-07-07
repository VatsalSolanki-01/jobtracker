package routes

import (
	"errors"
	"net/http"
	"strconv"
	"strings"

	"github.com/VatsalSolanki-01/jobtracker/config"
	"github.com/VatsalSolanki-01/jobtracker/models"
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type ApplicationInput struct {
	CompanyName string `json:"company_name"`
	JobRole     string `json:"job_role"`
	Status      string `json:"status"`
}

func getUserIDFromContext(c *gin.Context) (uint, bool) {
	userIDValue, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "User information missing in request context",
		})
		return 0, false
	}

	userID, ok := userIDValue.(uint)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid user information in request context",
		})
		return 0, false
	}

	return userID, true
}

func CreateApplication(c *gin.Context) {
	userID, ok := getUserIDFromContext(c)
	if !ok {
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
	input.Status = strings.TrimSpace(strings.ToLower(input.Status))

	if input.CompanyName == "" || input.JobRole == "" || input.Status == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Company name, job role, and status are required",
		})
		return
	}

	application := models.Application{
		CompanyName: input.CompanyName,
		JobRole:     input.JobRole,
		Status:      input.Status,
		UserID:      userID,
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
	userID, ok := getUserIDFromContext(c)
	if !ok {
		return
	}

	var applications []models.Application

	if err := config.DB.
		Where("user_id = ?", userID).
		Order("id DESC").
		Find(&applications).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch applications",
		})
		return
	}

	c.JSON(http.StatusOK, applications)
}

func GetApplicationByID(c *gin.Context) {
	userID, ok := getUserIDFromContext(c)
	if !ok {
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid application ID",
		})
		return
	}

	var application models.Application

	err = config.DB.
		Where("id = ? AND user_id = ?", id, userID).
		First(&application).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Application not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch application",
		})
		return
	}

	c.JSON(http.StatusOK, application)
}

func UpdateApplication(c *gin.Context) {
	userID, ok := getUserIDFromContext(c)
	if !ok {
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid application ID",
		})
		return
	}

	var application models.Application

	err = config.DB.
		Where("id = ? AND user_id = ?", id, userID).
		First(&application).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Application not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch application",
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
	input.Status = strings.TrimSpace(strings.ToLower(input.Status))

	if input.CompanyName == "" || input.JobRole == "" || input.Status == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Company name, job role, and status are required",
		})
		return
	}

	application.CompanyName = input.CompanyName
	application.JobRole = input.JobRole
	application.Status = input.Status

	if err := config.DB.Save(&application).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to update application",
		})
		return
	}

	c.JSON(http.StatusOK, application)
}

func DeleteApplication(c *gin.Context) {
	userID, ok := getUserIDFromContext(c)
	if !ok {
		return
	}

	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid application ID",
		})
		return
	}

	var application models.Application

	err = config.DB.
		Where("id = ? AND user_id = ?", id, userID).
		First(&application).Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{
				"error": "Application not found",
			})
			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch application",
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