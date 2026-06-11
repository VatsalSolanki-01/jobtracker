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

	// ✅ FIXED CORS FOR DEPLOYMENT (EC2 + Docker)
	router.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: false,
		MaxAge: 12 * time.Hour,
	}))

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "API is running",
		})
	})

	// Routes
	router.POST("/applications", routes.CreateApplication)
	router.GET("/applications", routes.GetApplications)
	router.GET("/applications/:id", routes.GetApplicationByID)
	router.PUT("/applications/:id", routes.UpdateApplication)
	router.DELETE("/applications/:id", routes.DeleteApplication)

	// Server
	router.Run(":8081")
}