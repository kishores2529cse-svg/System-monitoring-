package main

import (
	"context"
	"fmt"
	"log"

	"backend-auth/internal/config"
	"github.com/jackc/pgx/v5"
	"github.com/resend/resend-go/v2"
)

func main() {
	cfg := config.Load()

	dsn := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName, cfg.DBSSLMode)

	conn, err := pgx.Connect(context.Background(), dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close(context.Background())

	rows, err := conn.Query(context.Background(), "SELECT id, email FROM admins")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var email string
		if err := rows.Scan(&id, &email); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("Admin ID: %d, Email: %s\n", id, email)

		// Try sending a test email to this admin
		client := resend.NewClient(cfg.ResendAPIKey)
		params := &resend.SendEmailRequest{
			From:    "onboarding@resend.dev",
			To:      []string{email},
			Subject: "Test Email from CodeShield",
			Html:    "<p>This is a test email.</p>",
		}
		_, err = client.Emails.Send(params)
		if err != nil {
			fmt.Printf("Failed to send email to %s: %v\n", email, err)
		} else {
			fmt.Printf("Successfully sent email to %s\n", email)
		}
	}
}
