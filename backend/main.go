package main

import (
	"net/http"
	"strconv"

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

	router.GET("/applications/:id", func(c *gin.Context) {

		id, err := strconv.Atoi(c.Param("id"))

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid ID",
			})
			return
		}

		for _, application := range applications {
			if application.ID == id {
				c.JSON(http.StatusOK, application)
				return
			}
		}

		c.JSON(http.StatusNotFound, gin.H{
			"error": "Application not found",
		})
	})

	router.PUT("/applications/:id", func(c *gin.Context) {

		id, err := strconv.Atoi(c.Param("id"))

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid ID",
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

		for i, application := range applications {

			if application.ID == id {

				updatedApplication.ID = id

				applications[i] = updatedApplication

				c.JSON(http.StatusOK, updatedApplication)

				return
			}
		}

		c.JSON(http.StatusNotFound, gin.H{
			"error": "Application not found",
		})
	})

	router.DELETE("/applications/:id", func(c *gin.Context) {

		id, err := strconv.Atoi(c.Param("id"))

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid ID",
			})
			return
		}

		for i, application := range applications {

			if application.ID == id {

				applications = append(
					applications[:i],
					applications[i+1:]...,
				)

				c.JSON(http.StatusOK, gin.H{
					"message": "Application deleted successfully",
				})

				return
			}
		}

		c.JSON(http.StatusNotFound, gin.H{
			"error": "Application not found",
		})
	})

	router.Run(":8081")
}