package main

import (
	"time"

	"github.com/VatsalSolanki-01/jobtracker/config"
	"github.com/VatsalSolanki-01/jobtracker/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	config.ConnectDB()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept"},
		MaxAge: 12 * time.Hour,
	}))

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