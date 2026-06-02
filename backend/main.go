package main

import (
	"github.com/VatsalSolanki-01/jobtracker/config"
	"github.com/VatsalSolanki-01/jobtracker/routes"
	"github.com/gin-gonic/gin"
)

func main() {

	config.ConnectDB()

	router := gin.Default()

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "API is running",
		})
	})

	router.POST("/applications", routes.CreateApplication)

	router.GET("/applications", routes.GetApplications)

	router.GET("/applications/:id", routes.GetApplicationByID)

	router.PUT("/applications/:id", routes.UpdateApplication)

	router.DELETE("/applications/:id", routes.DeleteApplication)

	router.Run(":8081")
}