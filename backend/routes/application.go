package routes

import (
	"net/http"
	"strconv"

	"github.com/VatsalSolanki-01/jobtracker/config"
	"github.com/VatsalSolanki-01/jobtracker/models"
	"github.com/gin-gonic/gin"
)

func CreateApplication(c *gin.Context) {

	var application models.Application

	if err := c.ShouldBindJSON(&application); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	result := config.DB.Create(&application)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save application",
		})
		return
	}

	c.JSON(http.StatusCreated, application)
}

func GetApplications(c *gin.Context) {

	var applications []models.Application

	result := config.DB.Find(&applications)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to fetch applications",
		})
		return
	}

	c.JSON(http.StatusOK, applications)
}

func GetApplicationByID(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ID",
		})
		return
	}

	var application models.Application

	result := config.DB.First(&application, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Application not found",
		})
		return
	}

	c.JSON(http.StatusOK, application)
}

func UpdateApplication(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ID",
		})
		return
	}

	var application models.Application

	result := config.DB.First(&application, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Application not found",
		})
		return
	}

	var updatedApplication models.Application

	if err := c.ShouldBindJSON(&updatedApplication); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	application.CompanyName = updatedApplication.CompanyName
	application.JobRole = updatedApplication.JobRole
	application.Status = updatedApplication.Status

	config.DB.Save(&application)

	c.JSON(http.StatusOK, application)
}

func DeleteApplication(c *gin.Context) {

	id, err := strconv.Atoi(c.Param("id"))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid ID",
		})
		return
	}

	var application models.Application

	result := config.DB.First(&application, id)

	if result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": "Application not found",
		})
		return
	}

	config.DB.Delete(&application)

	c.JSON(http.StatusOK, gin.H{
		"message": "Application deleted successfully",
	})
}