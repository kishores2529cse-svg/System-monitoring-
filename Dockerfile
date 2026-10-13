# Multi-stage build for Go backend
FROM golang:1.24-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache git gcc musl-dev

# Download dependencies
COPY backend-auth/go.mod backend-auth/go.sum ./
RUN go mod download

# Copy source code and build binary
COPY backend-auth/ .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o server .

# Final lightweight runtime image
FROM alpine:3.19

WORKDIR /app

RUN apk --no-cache add ca-certificates tzdata

COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]
