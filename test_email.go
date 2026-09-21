package main

import (
	"fmt"
	"net/smtp"
)

func main() {
	host := "smtp.gmail.com"
	port := "587"
	user := "noreplysystemmonitoring@gmail.com"
	pass := "rbuijxmrzsvgzouv"

	auth := smtp.PlainAuth("", user, pass, host)
	addr := fmt.Sprintf("%s:%s", host, port)

	msg := []byte("To: kishores2529cse@gmail.com\r\n" +
		"Subject: Test Email\r\n" +
		"\r\n" +
		"This is a test email.\r\n")

	err := smtp.SendMail(addr, auth, user, []string{"kishores2529cse@gmail.com"}, msg)
	if err != nil {
		fmt.Printf("Error: %v\n", err)
	} else {
		fmt.Println("Success!")
	}
}
