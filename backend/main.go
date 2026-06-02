package main

import (
	"net/http"

	"github.com/VatsalSolanki-01/jobtracker/models"
	"github.com/gin-gonic/gin"
)

var applications []models.Application
var nextID = 1

func main() {

	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "API is running",
		})
	})

	router.POST("/applications", func(c *gin.Context) {

		var application models.Application

		if err := c.ShouldBindJSON(&application); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request body",
			})
			return
		}

		application.ID = nextID
		nextID++

		applications = append(applications, application)

		c.JSON(http.StatusCreated, application)
	})

	router.GET("/applications", func(c *gin.Context) {
		c.JSON(http.StatusOK, applications)
	})

	router.Run(":8081")
}