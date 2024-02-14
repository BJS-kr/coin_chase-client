package main

import (
	"changeme/protodef"
	"context"
	"fmt"
	"io"
	"log/slog"
	"net"
	"net/http"
	"strconv"
	"time"

	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"
)
const (
	SERVER_IP string = "127.0.0.1"
	SERVER_PORT int = 8888
)

var userId string
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

func (a *App) SetId(id string) {
	userId = id
}

func (a *App) GetId()string {
	return userId
}

func (a *App) LogIn(userId string) int {
		// 아무 빈 포트에 할당한다.
		addr, err := net.ResolveUDPAddr("udp", ":0")
	
		if err != nil {
			slog.Debug(err.Error())
			panic(err)
		}
	
		conn, err := net.ListenUDP("udp", addr)
	
		if err != nil {
			slog.Debug(err.Error())
			panic(err)
		}

		resp, err := http.Get("https://ipinfo.io/ip")

		if err != nil {
			slog.Debug(err.Error())
			panic(err)
		}

		defer resp.Body.Close()

		byteIp, err := io.ReadAll(resp.Body)

		if err != nil {
			slog.Debug(err.Error())
			panic(err)
		}

		ip := string(byteIp)
		clientPort := conn.LocalAddr().(*net.UDPAddr).Port

		workerResp, err := http.Get(fmt.Sprintf("%s/get-worker-port/%s/%s/%d",SERVER_IP, userId, ip, clientPort))
		
		if err != nil {
			slog.Debug(err.Error())
			panic(err)
		}

		defer workerResp.Body.Close()

		workerPort, err := io.ReadAll(workerResp.Body)

		if err != nil {
			slog.Debug(err.Error())
			panic(err)
		}

		port, err := strconv.Atoi(string(workerPort))
		
		if err != nil {
			slog.Debug(err.Error())
			panic(err)
		}

		return port
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

	serverAddr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", SERVER_IP, SERVER_PORT))

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
