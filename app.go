package main

import (
	"changeme/protodef"
	"context"
	"fmt"
	"log/slog"
	"net"
	"time"

	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"
)

type ClientStatus struct {
	Id    int32
	X     int32
	Y     int32
	Items []int32
}

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) SendStatus(clientStatus ClientStatus) {
	status := protodef.Status{
		Id:     clientStatus.Id,
		X:      clientStatus.X,
		Y:      clientStatus.Y,
		Items:  clientStatus.Items,
		SentAt: timestamppb.New(time.Now()),
	}

	data, err := proto.Marshal(&status)

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	serverAddr, err := net.ResolveUDPAddr("udp", ":8888")

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	server, err := net.DialUDP("udp", nil, serverAddr)

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	result, err := server.Write(data)

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	slog.Debug(fmt.Sprintf("%d", result))
}
