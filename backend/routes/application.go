package routes

import (
	"net/http"

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
