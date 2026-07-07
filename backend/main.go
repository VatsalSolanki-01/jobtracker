package main

import (
	"time"

	"github.com/VatsalSolanki-01/jobtracker/config"
	"github.com/VatsalSolanki-01/jobtracker/middleware"
	"github.com/VatsalSolanki-01/jobtracker/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	config.ConnectDB()

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:5173",
			"http://localhost:3000",
		},
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: false,
		MaxAge: 12 * time.Hour,
	}))

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "API is running",
		})
	})

	authRoutes := router.Group("/auth")
	{
		authRoutes.POST("/register", routes.Register)
		authRoutes.POST("/login", routes.Login)
	}

	applicationRoutes := router.Group("/applications")
	applicationRoutes.Use(middleware.AuthMiddleware())
	{
		applicationRoutes.POST("", routes.CreateApplication)
		applicationRoutes.GET("", routes.GetApplications)
		applicationRoutes.GET("/:id", routes.GetApplicationByID)
		applicationRoutes.PUT("/:id", routes.UpdateApplication)
		applicationRoutes.DELETE("/:id", routes.DeleteApplication)
	}

	router.Run(":8081")
}