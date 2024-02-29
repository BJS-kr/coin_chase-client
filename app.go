package main

import (
	"changeme/protodef"
	"context"
	"fmt"
	"io"
	"log"
	"log/slog"
	"net"
	"net/http"
	"strconv"

	"github.com/golang/snappy"
	"google.golang.org/protobuf/proto"
)

const (
	SERVER_IP         string = "127.0.0.1"
	SERVER_LOGIN_PORT int    = 8888
)

var serverPort int
var userId string
var conn *net.UDPConn
var userRelatedPositions *protodef.RelatedPositions
var receiveStarted bool

type Item struct {
	Id     string
	Name   string
	Amount int32
}
type Position struct {
	X int32
	Y int32
}
type ClientStatus struct {
	ID              string
	CurrentPosition *Position
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
func (a *App) SetConn(udpConn *net.UDPConn) {
	conn = udpConn
}
func (a *App) SetRelatedPositions(relatedPositions *protodef.RelatedPositions) {
	userRelatedPositions = relatedPositions
}
func (a *App) GetRelatedPositions() *protodef.RelatedPositions {
	return userRelatedPositions
}

func (a *App) GetId() string {
	return userId
}
func (a *App) SetServerPort(port int) {
	serverPort = port
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

	clientPort := conn.LocalAddr().(*net.UDPAddr).Port

	workerResp, err := http.Get(fmt.Sprintf("http://%s:%d/get-worker-port/%s/%d", SERVER_IP, SERVER_LOGIN_PORT, userId, clientPort))

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

	a.SetId(userId)
	a.SetConn(conn)

	return port
}

func (a *App) StartUpdateMapStatus() {
	if receiveStarted {
		return
	}
	receiveStarted = true
	go func() {
		for {
			buffer := make([]byte, 1024)
			amount, _, err := conn.ReadFromUDP(buffer)

			if err != nil {
				log.Fatal(err.Error())
			}
			// packet을 576bytes이하로 유지하기 위해 snappy를 씁니다.
			decompressed, err := snappy.Decode(nil, buffer[:amount])

			if err != nil {
				slog.Debug(err.Error())
			}

			relatedPositions := &protodef.RelatedPositions{}
			desErr := proto.Unmarshal(decompressed, relatedPositions)

			if desErr != nil {
				log.Fatal(err.Error())
			}

			a.SetRelatedPositions(relatedPositions)
		}
	}()
}

func (a *App) SendStatus(clientStatus ClientStatus) {

	status := protodef.Status{
		Id: clientStatus.ID,
		CurrentPosition: &protodef.Position{
			X: clientStatus.CurrentPosition.X,
			Y: clientStatus.CurrentPosition.Y,
		},
	}

	data, err := proto.Marshal(&status)

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	serverAddr, err := net.ResolveUDPAddr("udp", fmt.Sprintf("%s:%d", SERVER_IP, serverPort))

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	server, err := net.DialUDP("udp", nil, serverAddr)

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}

	_, err = server.Write(data)

	if err != nil {
		slog.Debug(err.Error())
		panic(err)
	}
}
